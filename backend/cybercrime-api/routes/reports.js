const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/reports';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Create different upload handlers
const uploadFiles = upload.array('files');
const noFiles = upload.none();

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const { type, status, submitted_by, page = 1, limit = 10 } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (type) {
      whereClauses.push('TYPE = :type');
      binds.type = type;
    }
    if (status) {
      whereClauses.push('STATUS = :status');
      binds.status = status;
    }
    if (submitted_by) {
      whereClauses.push('SUBMITTED_BY = :submitted_by');
      binds.submitted_by = submitted_by;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT 
        R.REPORT_ID, R.SUBMITTED_BY, R.TITLE, R.DESCRIPTION, R.LOCATION, 
        R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT,
        C.CRIME_CATEGORY, C.SUSPECT_DESCRIPTION, C.VICTIM_INVOLVED,
        C.WEAPON_INVOLVED, C.INJURY_LEVEL, C.EVIDENCE_DETAILS,
        F.FACILITY_TYPE, F.SEVERITY_LEVEL, F.AFFECTED_EQUIPMENT
      FROM REPORT R
      LEFT JOIN CRIME C ON R.REPORT_ID = C.REPORT_ID
      LEFT JOIN FACILITY F ON R.REPORT_ID = F.REPORT_ID
      ${whereClause}
      ORDER BY R.SUBMITTED_AT DESC
    `;
    
    const result = await exec(sql, binds);
    const serializedRows = result.rows.map(row => {
      const serialized = {};
      for (const key in row) {
        const value = row[key];
        if (value instanceof Date) {
          serialized[key] = value.toISOString();
        } else if (value !== null && typeof value === 'object' && value.toString) {
          serialized[key] = value.toString();
        } else {
          serialized[key] = value;
        }
      }
      return serialized;
    });
    
    res.json(serializedRows);
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).json({ error: 'Failed to get reports', details: err.message });
  }
});

// POST /api/reports
router.post('/', authenticateToken, async (req, res) => {
  const { dbConfig } = require('../database/connection');
  let connection;
  
  try {
    console.log("=== STARTING REPORT SUBMISSION ===");
    console.log("Content-Type header:", req.headers['content-type']);
    console.log("User:", req.user);
    
    let reportData;
    let files = [];
    
    // Check content type to handle both JSON and FormData
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      // Direct JSON request
      reportData = req.body;
      console.log("Handling JSON request");
    } else if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      // FormData request - parse it manually
      console.log("Handling FormData request");
      
      // For now, let's handle JSON in FormData
      // In a real app, you'd parse the FormData properly
      return res.status(400).json({ 
        error: 'Please use JSON format for now. File upload coming soon.' 
      });
    } else {
      // Try to parse as JSON anyway
      try {
        reportData = req.body;
        console.log("Attempting to parse as JSON");
      } catch (err) {
        console.error("Failed to parse request body:", err);
        return res.status(400).json({ 
          error: 'Invalid request format. Please use JSON.' 
        });
      }
    }
    
    console.log("Parsed report data:", reportData);
    
    const { 
      title, description, location, type,
      // Crime-specific fields
      crime_category, suspect_description, victim_involved, 
      weapon_involved, injury_level, evidence_details,
      // Facility-specific fields
      facility_type, severity_level, affected_equipment
    } = reportData;
    
    // Validation
    if (!title || !description || !location || !type) {
      console.log("Validation failed - missing required fields");
      return res.status(400).json({ 
        error: 'Title, description, location, and type are required' 
      });
    }

    if (type === 'CRIME' && !crime_category) {
      console.log("Validation failed - missing crime_category");
      return res.status(400).json({ error: 'Crime category is required for crime reports' });
    }
    
    if (type === 'FACILITY' && (!facility_type || !severity_level)) {
      return res.status(400).json({ 
        error: 'Facility type and severity level are required for facility reports' 
      });
    }

    // Get connection for transaction
    connection = await oracledb.getConnection(dbConfig);

    // Insert into REPORT table
    const reportSql = `
      INSERT INTO REPORT (
        REPORT_ID, SUBMITTED_BY, TITLE, DESCRIPTION, LOCATION, STATUS, TYPE, 
        SUBMITTED_AT, UPDATED_AT
      ) VALUES (
        report_seq.NEXTVAL, :submitted_by, :title, :description, :location, :status, :type, 
        SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING REPORT_ID INTO :report_id
    `;
    
    const reportBinds = {
      submitted_by: req.user.accountId,
      title,
      description,
      location,
      status: 'PENDING',
      type,
      report_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    console.log("Executing report insert with binds:", reportBinds);
    const reportResult = await connection.execute(reportSql, reportBinds);
    const reportId = reportResult.outBinds.report_id[0];

    console.log('Created report with ID:', reportId);

    // Insert into type-specific table
    if (type === 'CRIME') {
      const crimeSql = `
        INSERT INTO CRIME (
          REPORT_ID, CRIME_CATEGORY, SUSPECT_DESCRIPTION, VICTIM_INVOLVED, 
          INJURY_LEVEL, WEAPON_INVOLVED, EVIDENCE_DETAILS
        ) VALUES (
          :report_id, :crime_category, :suspect_description, :victim_involved,
          :injury_level, :weapon_involved, :evidence_details
        )
      `;

      const crimeBinds = {
        report_id: reportId,
        crime_category,
        suspect_description: suspect_description || null,
        victim_involved: victim_involved || null,
        injury_level: injury_level || null,
        weapon_involved: weapon_involved || null,
        evidence_details: evidence_details || null
      };

      console.log('Inserting crime with data:', crimeBinds);
      await connection.execute(crimeSql, crimeBinds);
      
    } else if (type === 'FACILITY') {
      const facilitySql = `
        INSERT INTO FACILITY (
          REPORT_ID, FACILITY_TYPE, SEVERITY_LEVEL, AFFECTED_EQUIPMENT
        ) VALUES (
          :report_id, :facility_type, :severity_level, :affected_equipment
        )
      `;

      const facilityBinds = {
        report_id: reportId,
        facility_type,
        severity_level,
        affected_equipment: affected_equipment || null
      };

      console.log('Inserting facility with data:', facilityBinds);
      await connection.execute(facilitySql, facilityBinds);
    }

    // Commit both inserts
    await connection.commit();
    console.log('Transaction committed successfully');
    
    res.status(201).json({
      message: 'Report created successfully',
      report_id: reportId
    });
    
  } catch (err) {
    console.error('=== CREATE REPORT ERROR ===');
    console.error('Error:', err);
    console.error('Error stack:', err.stack);
    
    // Rollback on error
    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back');
      } catch (rollbackErr) {
        console.error('Rollback error:', rollbackErr);
      }
    }
    
    // Check for common Oracle errors
    if (err.message && err.message.includes('ORA-02291')) {
      return res.status(400).json({ 
        error: 'Invalid foreign key reference. Please check your data.' 
      });
    }
    if (err.message && err.message.includes('ORA-00001')) {
      return res.status(400).json({ 
        error: 'Duplicate entry. This report already exists.' 
      });
    }
    if (err.message && err.message.includes('ORA-01400')) {
      return res.status(400).json({ 
        error: 'Required field is missing. Please check all required fields.' 
      });
    }
    if (err.message && err.message.includes('ORA-00942')) {
      return res.status(500).json({ 
        error: 'Database table or view does not exist. Please check database setup.' 
      });
    }
    if (err.message && err.message.includes('ORA-06550')) {
      return res.status(500).json({ 
        error: 'Database sequence error. Please check if report_seq exists.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create report', 
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET /api/reports/my-reports
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let whereClauses = ['SUBMITTED_BY = :submitted_by'];
    const binds = { submitted_by: req.user.accountId };

    if (type) {
      whereClauses.push('TYPE = :type');
      binds.type = type;
    }
    if (status) {
      whereClauses.push('STATUS = :status');
      binds.status = status;
    }

    const whereClause = whereClauses.join(' AND ');
    
    const sql = `SELECT * FROM REPORT WHERE ${whereClause} ORDER BY SUBMITTED_AT DESC`;
    const result = await exec(sql, binds);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Get my reports error:', err);
    res.status(500).json({ error: 'Failed to get reports', details: err.message });
  }
});

// GET /api/reports/search
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, type, status, date_from, date_to, location } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (q) {
      whereClauses.push('(UPPER(TITLE) LIKE :q OR UPPER(DESCRIPTION) LIKE :q)');
      binds.q = `%${q.toUpperCase()}%`;
    }
    if (type) {
      whereClauses.push('TYPE = :type');
      binds.type = type;
    }
    if (status) {
      whereClauses.push('STATUS = :status');
      binds.status = status;
    }
    if (date_from) {
      whereClauses.push('SUBMITTED_AT >= TO_DATE(:date_from, \'YYYY-MM-DD\')');
      binds.date_from = date_from;
    }
    if (date_to) {
      whereClauses.push('SUBMITTED_AT <= TO_DATE(:date_to, \'YYYY-MM-DD\')');
      binds.date_to = date_to;
    }
    if (location) {
      whereClauses.push('UPPER(LOCATION) LIKE :location');
      binds.location = `%${location.toUpperCase()}%`;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `SELECT * FROM REPORT ${whereClause} ORDER BY SUBMITTED_AT DESC`;
    const result = await exec(sql, binds);

    res.json(result.rows);
  } catch (err) {
    console.error('Search reports error:', err);
    res.status(500).json({ error: 'Failed to search reports', details: err.message });
  }
});

// DELETE /api/reports/bulk-delete
router.delete('/bulk-delete', authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'IDs array is required' });
    }

    const placeholders = ids.map((_, i) => `:id${i}`).join(',');
    const binds = {};
    ids.forEach((id, i) => binds[`id${i}`] = id);

    await exec(
      `DELETE FROM REPORT WHERE REPORT_ID IN (${placeholders})`,
      binds,
      { autoCommit: true }
    );

    res.json({ message: `${ids.length} reports deleted`, deleted: ids.length });
  } catch (err) {
    console.error('Bulk delete error:', err);
    res.status(500).json({ error: 'Failed to delete reports', details: err.message });
  }
});

// PUT /api/reports/bulk-update-status
router.put('/bulk-update-status', authenticateToken, async (req, res) => {
  try {
    const { ids, status } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
      return res.status(400).json({ error: 'IDs array and status are required' });
    }

    const placeholders = ids.map((_, i) => `:id${i}`).join(',');
    const binds = { status };
    ids.forEach((id, i) => binds[`id${i}`] = id);

    await exec(
      `UPDATE REPORT SET STATUS = :status, UPDATED_AT = SYSTIMESTAMP 
       WHERE REPORT_ID IN (${placeholders})`,
      binds,
      { autoCommit: true }
    );

    res.json({ message: `${ids.length} reports updated`, updated: ids.length });
  } catch (err) {
    console.error('Bulk update error:', err);
    res.status(500).json({ error: 'Failed to update reports', details: err.message });
  }
});

// GET /api/reports/export
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const { format = 'csv', type, status, date_from, date_to } = req.query;
    
    // This is a simplified version - in production, use a proper CSV/Excel library
    let whereClauses = [];
    const binds = {};

    if (type) {
      whereClauses.push('TYPE = :type');
      binds.type = type;
    }
    if (status) {
      whereClauses.push('STATUS = :status');
      binds.status = status;
    }
    if (date_from) {
      whereClauses.push('SUBMITTED_AT >= TO_DATE(:date_from, \'YYYY-MM-DD\')');
      binds.date_from = date_from;
    }
    if (date_to) {
      whereClauses.push('SUBMITTED_AT <= TO_DATE(:date_to, \'YYYY-MM-DD\')');
      binds.date_to = date_to;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `SELECT * FROM REPORT ${whereClause} ORDER BY SUBMITTED_AT DESC`;
    const result = await exec(sql, binds);

    // Simple CSV conversion
    if (format === 'csv') {
      const headers = Object.keys(result.rows[0] || {}).join(',');
      const rows = result.rows.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="reports-export.csv"`);
      res.send(csv);
    } else {
      res.json({ message: 'Excel export not implemented yet', data: result.rows });
    }
  } catch (err) {
    console.error('Export reports error:', err);
    res.status(500).json({ error: 'Failed to export reports', details: err.message });
  }
});

// GET /api/reports/by-location
router.get('/by-location', authenticateToken, async (req, res) => {
  try {
    const { date_from, date_to } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (date_from) {
      whereClauses.push('SUBMITTED_AT >= TO_DATE(:date_from, \'YYYY-MM-DD\')');
      binds.date_from = date_from;
    }
    if (date_to) {
      whereClauses.push('SUBMITTED_AT <= TO_DATE(:date_to, \'YYYY-MM-DD\')');
      binds.date_to = date_to;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT LOCATION, COUNT(*) as COUNT 
      FROM REPORT ${whereClause}
      GROUP BY LOCATION
      ORDER BY COUNT DESC
    `;
    
    const result = await exec(sql, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Get reports by location error:', err);
    res.status(500).json({ error: 'Failed to get reports by location', details: err.message });
  }
});

// GET /api/reports/by-date-range
router.get('/by-date-range', authenticateToken, async (req, res) => {
  try {
    const { date_from, date_to, group_by = 'day' } = req.query;
    
    if (!date_from || !date_to) {
      return res.status(400).json({ error: 'date_from and date_to are required' });
    }

    let dateFormat;
    switch (group_by) {
      case 'week':
        dateFormat = 'IW';
        break;
      case 'month':
        dateFormat = 'MM';
        break;
      default:
        dateFormat = 'DD';
    }

    const sql = `
      SELECT TO_CHAR(SUBMITTED_AT, 'YYYY-${dateFormat}') as DATE_GROUP, COUNT(*) as COUNT
      FROM REPORT
      WHERE SUBMITTED_AT >= TO_DATE(:date_from, 'YYYY-MM-DD')
      AND SUBMITTED_AT <= TO_DATE(:date_to, 'YYYY-MM-DD')
      GROUP BY TO_CHAR(SUBMITTED_AT, 'YYYY-${dateFormat}')
      ORDER BY DATE_GROUP
    `;
    
    const result = await exec(sql, { date_from, date_to });
    res.json(result.rows);
  } catch (err) {
    console.error('Get reports by date range error:', err);
    res.status(500).json({ error: 'Failed to get reports by date range', details: err.message });
  }
});

// GET /api/reports/with-details - Get reports with their type-specific details
router.get('/with-details', async (req, res) => {
  try {
    const { type } = req.query;
    
    if (type === 'CRIME') {
      // Join REPORT with CRIME table
      const sql = `
        SELECT 
          R.REPORT_ID, R.SUBMITTED_BY, R.TITLE, R.DESCRIPTION, R.LOCATION, 
          R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT,
          C.CRIME_CATEGORY, C.SUSPECT_DESCRIPTION, C.VICTIM_INVOLVED,
          C.WEAPON_INVOLVED, C.INJURY_LEVEL, C.EVIDENCE_DETAILS
        FROM REPORT R
        LEFT JOIN CRIME C ON R.REPORT_ID = C.REPORT_ID
        WHERE R.TYPE = 'CRIME'
        ORDER BY R.SUBMITTED_AT DESC
      `;
      
      const result = await exec(sql, {});
      
      // Serialize the results
      const serializedRows = result.rows.map(row => {
        const serialized = {};
        for (const key in row) {
          const value = row[key];
          if (value instanceof Date) {
            serialized[key] = value.toISOString();
          } else if (value !== null && typeof value === 'object' && value.toString) {
            serialized[key] = value.toString();
          } else {
            serialized[key] = value;
          }
        }
        return serialized;
      });
      
      res.json(serializedRows);
      
    } else if (type === 'FACILITY') {
      // Join REPORT with FACILITY table
      const sql = `
        SELECT 
          R.REPORT_ID, R.SUBMITTED_BY, R.TITLE, R.DESCRIPTION, R.LOCATION,
          R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT,
          F.FACILITY_TYPE, F.SEVERITY_LEVEL, F.AFFECTED_EQUIPMENT
        FROM REPORT R
        LEFT JOIN FACILITY F ON R.REPORT_ID = F.REPORT_ID
        WHERE R.TYPE = 'FACILITY'
        ORDER BY R.SUBMITTED_AT DESC
      `;
      
      const result = await exec(sql, {});
      
      // Serialize the results
      const serializedRows = result.rows.map(row => {
        const serialized = {};
        for (const key in row) {
          const value = row[key];
          if (value instanceof Date) {
            serialized[key] = value.toISOString();
          } else if (value !== null && typeof value === 'object' && value.toString) {
            serialized[key] = value.toString();
          } else {
            serialized[key] = value;
          }
        }
        return serialized;
      });
      
      res.json(serializedRows);
      
    } else {
      // No type specified, return all reports
      const sql = `SELECT * FROM REPORT ORDER BY SUBMITTED_AT DESC`;
      const result = await exec(sql, {});
      
      const serializedRows = result.rows.map(row => {
        const serialized = {};
        for (const key in row) {
          const value = row[key];
          if (value instanceof Date) {
            serialized[key] = value.toISOString();
          } else if (value !== null && typeof value === 'object' && value.toString) {
            serialized[key] = value.toString();
          } else {
            serialized[key] = value;
          }
        }
        return serialized;
      });
      
      res.json(serializedRows);
    }
  } catch (err) {
    console.error('Get reports with details error:', err);
    res.status(500).json({ error: 'Failed to get reports', details: err.message });
  }
});

// GET /api/reports/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // First get the basic report
    const reportResult = await exec(
      `SELECT * FROM REPORT WHERE REPORT_ID = :id`,
      { id: req.params.id }
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = reportResult.rows[0];
    let detailedReport = { ...report };

    // Get type-specific details
    if (report.TYPE === 'CRIME') {
      const crimeResult = await exec(
        `SELECT * FROM CRIME WHERE REPORT_ID = :id`,
        { id: req.params.id }
      );
      if (crimeResult.rows.length > 0) {
        detailedReport = { ...report, ...crimeResult.rows[0] };
      }
    } else if (report.TYPE === 'FACILITY') {
      const facilityResult = await exec(
        `SELECT * FROM FACILITY WHERE REPORT_ID = :id`,
        { id: req.params.id }
      );
      if (facilityResult.rows.length > 0) {
        detailedReport = { ...report, ...facilityResult.rows[0] };
      }
    }

    // Serialize the response
    const serializedReport = {};
    for (const key in detailedReport) {
      const value = detailedReport[key];
      if (value instanceof Date) {
        serializedReport[key] = value.toISOString();
      } else if (value !== null && typeof value === 'object' && value.toString) {
        serializedReport[key] = value.toString();
      } else {
        serializedReport[key] = value;
      }
    }

    res.json(serializedReport);
  } catch (err) {
    console.error('Get report error:', err);
    res.status(500).json({ error: 'Failed to get report', details: err.message });
  }
});

// PUT /api/reports/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const fields = Object.keys(data).filter(k => k !== 'id');
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updates = fields.map((f, i) => `${f.toUpperCase()} = :v${i}`);
    const binds = {};
    fields.forEach((f, i) => binds[`v${i}`] = data[f]);
    binds.id = req.params.id;

    updates.push('UPDATED_AT = SYSTIMESTAMP');

    const sql = `UPDATE REPORT SET ${updates.join(', ')} WHERE REPORT_ID = :id`;
    await exec(sql, binds, { autoCommit: true });

    res.json({ message: 'Report updated successfully' });
  } catch (err) {
    console.error('Update report error:', err);
    res.status(500).json({ error: 'Failed to update report', details: err.message });
  }
});

// DELETE /api/reports/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await exec(
      `DELETE FROM REPORT WHERE REPORT_ID = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Delete report error:', err);
    res.status(500).json({ error: 'Failed to delete report', details: err.message });
  }
});

module.exports = router;
