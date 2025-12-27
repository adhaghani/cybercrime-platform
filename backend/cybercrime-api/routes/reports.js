const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { toPlainRows } = require('../helper/toPlainRows');
const router = express.Router();

// GET /api/reports
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, status, submitted_by, start_date, end_date, page = 1, limit = 10 } = req.query;
    
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
    if (start_date) {
      whereClauses.push('TRUNC(SUBMITTED_AT) >= TO_DATE(:start_date, \'YYYY-MM-DD\')');
      binds.start_date = start_date;
    }
    if (end_date) {
      whereClauses.push('TRUNC(SUBMITTED_AT) <= TO_DATE(:end_date, \'YYYY-MM-DD\')');
      binds.end_date = end_date;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `SELECT REPORT_ID, SUBMITTED_BY, TITLE, DESCRIPTION, TYPE, LOCATION, STATUS, SUBMITTED_AT, UPDATED_AT 
                 FROM REPORT ${whereClause} ORDER BY SUBMITTED_AT DESC`;
    
    const result = await exec(sql, binds);
    const reports = toPlainRows(result.rows);
    res.json({ reports, total: reports.length });
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).json({ error: 'Failed to get reports', details: err.message });
  }
});

// POST /api/reports
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { submitted_by, title, description, location, status, type, attachment_path,
      // CRIME RELATED FIELDS
       crime_category, suspect_description, victim_involved, weapon_involved,
       injury_level, evidence_details,
      // FACILITY RELATED FIELDS
        facility_type, severity_level, affected_equipment
     } = req.body;
    
    if (!title || !description || !location || !type) {
      return res.status(400).json({ error: 'Title, description, location, and type are required' });
    }

    const sql = `
      INSERT INTO REPORT (
        REPORT_ID, SUBMITTED_BY, TITLE, DESCRIPTION, LOCATION, STATUS, TYPE, 
        ATTACHMENT_PATH, SUBMITTED_AT, UPDATED_AT
      ) VALUES (
        report_seq.NEXTVAL, :submitted_by, :title, :description, :location, :status, :type, 
        :attachment_path, SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING REPORT_ID INTO :id
    `;
    
    const binds = {
      submitted_by: submitted_by || req.user.accountId,
      title,
      description,
      location,
      status: status || 'PENDING',
      type,
      attachment_path: attachment_path || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });

    if(type === 'CRIME'){
      try {
      const crimeSql = `
      UPDATE CRIME SET
        CRIME_CATEGORY = :crime_category,
        SUSPECT_DESCRIPTION = :suspect_description,
        VICTIM_INVOLVED = :victim_involved,
        WEAPON_INVOLVED = :weapon_involved,
        INJURY_LEVEL = :injury_level,
        EVIDENCE_DETAILS = :evidence_details
      WHERE REPORT_ID = :report_id 
      `;
      const crimeBinds = {
        report_id: result.outBinds.id[0],
        crime_category: crime_category,
        suspect_description: suspect_description || null,
        victim_involved: victim_involved ?  victim_involved : 'N/A',
        weapon_involved: weapon_involved ? weapon_involved : 'N/A',
        injury_level: injury_level || null,
        evidence_details: evidence_details || null
      };
      await exec(crimeSql, crimeBinds, { autoCommit: true }); 
    } catch (err) {
      console.error('Insert crime details error:', err);
      await exec('ROLLBACK');
      return res.status(500).json({ error: 'Failed to create crime report', details: err.message });
    }
  }
    else {
try{
      const facilitySql = `
      UPDATE FACILITY SET
        FACILITY_TYPE = :facility_type,
        SEVERITY_LEVEL = :severity_level,
        AFFECTED_EQUIPMENT = :affected_equipment
      WHERE REPORT_ID = :report_id
      `;
      const facilityBinds = {
        report_id: result.outBinds.id[0],
        facility_type: facility_type,
        severity_level: severity_level || null,
        affected_equipment: affected_equipment || null
      };
      await exec(facilitySql, facilityBinds, { autoCommit: true });
    } catch (err) {
      console.error('Insert facility details error:', err);
      await exec('ROLLBACK');
      return res.status(500).json({ error: 'Failed to create facility report', details: err.message });
    }
    }

    res.status(201).json({
      message: 'Report created successfully',
      report_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create report error:', err);
    await exec('ROLLBACK');
    res.status(500).json({ error: 'Failed to create report', details: err.message });
  }
});

// GET /api/reports/my-reports
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const { type, status } = req.query;
    
    console.log('req.user:', req.user);
    console.log('req.user.accountId:', req.user.accountId);
    console.log('Query params:', { type, status });
    
    // Try different possible user ID field names
    const userId = req.user.accountId || req.user.ACCOUNT_ID || req.user.id;
    console.log('Using userId:', userId);
    
    let whereClauses = ['R.SUBMITTED_BY = :submitted_by'];
    const binds = { submitted_by: userId };

    if (type) {
      whereClauses.push('R.TYPE = :type');
      binds.type = type;
    }
    if (status) {
      whereClauses.push('R.STATUS = :status');
      binds.status = status;
    }

    const whereClause = whereClauses.join(' AND ');
    
    let sql;
    if (type === 'CRIME') {
      sql = `
        SELECT 
          R.REPORT_ID, R.SUBMITTED_BY, R.TITLE, R.DESCRIPTION, R.LOCATION, 
          R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT,
          C.CRIME_CATEGORY, C.SUSPECT_DESCRIPTION, C.VICTIM_INVOLVED,
          C.WEAPON_INVOLVED, C.INJURY_LEVEL, C.EVIDENCE_DETAILS
        FROM REPORT R
        LEFT JOIN CRIME C ON R.REPORT_ID = C.REPORT_ID
        WHERE ${whereClause}
        ORDER BY R.SUBMITTED_AT DESC
      `;
    } else if (type === 'FACILITY') {
      sql = `
        SELECT 
          R.REPORT_ID, R.SUBMITTED_BY, R.TITLE, R.DESCRIPTION, R.LOCATION,
          R.STATUS, R.TYPE, R.SUBMITTED_AT, R.UPDATED_AT,
          F.FACILITY_TYPE, F.SEVERITY_LEVEL, F.AFFECTED_EQUIPMENT
        FROM REPORT R
        LEFT JOIN FACILITY F ON R.REPORT_ID = F.REPORT_ID
        WHERE ${whereClause}
        ORDER BY R.SUBMITTED_AT DESC
      `;
    } else {
      sql = `SELECT * FROM REPORT R WHERE ${whereClause} ORDER BY R.SUBMITTED_AT DESC`;
    }
    
    console.log('Executing SQL:', sql);
    console.log('With binds:', binds);
    
    const result = await exec(sql, binds);
    console.log('Raw result.rows:', result.rows);
    
    const reports = toPlainRows(result.rows);
    console.log('After toPlainRows:', reports);
    
    res.json(reports);
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
    const result = await exec(
      `SELECT * FROM REPORT WHERE REPORT_ID = :id`,
      { id: req.params.id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = result.rows[0];
    let detailedReport = { ...report };

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

    // Get assignments and assigned staff details
    const assignmentsResult = await exec(
      `SELECT 
        RA.ASSIGNMENT_ID, RA.ACCOUNT_ID, RA.REPORT_ID, 
        RA.ASSIGNED_AT, RA.ACTION_TAKEN, RA.ADDITIONAL_FEEDBACK, RA.UPDATED_AT,
        A.NAME, A.EMAIL, A.CONTACT_NUMBER, A.ACCOUNT_TYPE,
        S.STAFF_ID, S.ROLE, S.DEPARTMENT, S.POSITION
      FROM REPORT_ASSIGNMENT RA
      INNER JOIN ACCOUNT A ON RA.ACCOUNT_ID = A.ACCOUNT_ID
      LEFT JOIN STAFF S ON A.ACCOUNT_ID = S.ACCOUNT_ID
      WHERE RA.REPORT_ID = :id
      ORDER BY RA.ASSIGNED_AT DESC`,
      { id: req.params.id }
    );

    const assignments = toPlainRows(assignmentsResult.rows);
    detailedReport.STAFF_ASSIGNED = assignments;
  
    const resolutionsResult = await exec(
      `SELECT * FROM RESOLUTION WHERE REPORT_ID = :id ORDER BY RESOLVED_AT DESC`,
      { id: req.params.id }
    );

    const resolutions = toPlainRows(resolutionsResult.rows);
    detailedReport.RESOLUTIONS = resolutions.length > 0 ? resolutions[0] : null;

    res.json(detailedReport);
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
