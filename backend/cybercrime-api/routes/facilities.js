const express = require('express');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/facilities
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await exec(`SELECT * FROM FACILITY ORDER BY REPORT_ID DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('Get facilities error:', err);
    res.status(500).json({ error: 'Failed to get facilities', details: err.message });
  }
});

// POST /api/facilities
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { report_id, facility_type, severity_level, affected_equipment } = req.body;

    if (!report_id || !facility_type || !severity_level) {
      return res.status(400).json({ error: 'Report ID, facility type, and severity level are required' });
    }

    const sql = `
      INSERT INTO FACILITY (REPORT_ID, FACILITY_TYPE, SEVERITY_LEVEL, AFFECTED_EQUIPMENT)
      VALUES (:report_id, :facility_type, :severity_level, :affected_equipment)
    `;

    await exec(sql, {
      report_id,
      facility_type,
      severity_level,
      affected_equipment: affected_equipment || null
    }, { autoCommit: true });

    res.status(201).json({ message: 'Facility record created successfully' });
  } catch (err) {
    console.error('Create facility error:', err);
    res.status(500).json({ error: 'Failed to create facility record', details: err.message });
  }
});

// GET /api/facilities/my-reports
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const { severity_level } = req.query;
    
    let whereClauses = ['R.SUBMITTED_BY = :user_id'];
    const binds = { user_id: req.user.accountId };

    if (severity_level) {
      whereClauses.push('F.SEVERITY_LEVEL = :severity_level');
      binds.severity_level = severity_level;
    }

    const whereClause = whereClauses.join(' AND ');
    
    const sql = `
      SELECT F.*, R.TITLE, R.LOCATION, R.STATUS, R.SUBMITTED_AT, R.DESCRIPTION
      FROM FACILITY F
      JOIN REPORT R ON F.REPORT_ID = R.REPORT_ID
      WHERE ${whereClause}
      ORDER BY R.SUBMITTED_AT DESC
    `;
    
    const result = await exec(sql, binds);
    
    // Serialize to avoid circular references
    const cleanRows = result.rows.map(row => {
      const cleanRow = {};
      Object.keys(row).forEach(key => {
        if (typeof row[key] !== 'object' || row[key] === null) {
          cleanRow[key] = row[key];
        } else if (row[key] instanceof Date) {
          cleanRow[key] = row[key].toISOString();
        } else if (typeof row[key].toString === 'function') {
          cleanRow[key] = row[key].toString();
        }
      });
      return cleanRow;
    });
    
    res.json(cleanRows);
  } catch (err) {
    console.error('Get my facilities error:', err);
    res.status(500).json({ error: 'Failed to get facilities', details: err.message });
  }
});

// GET /api/facilities/by-severity
router.get('/by-severity', authenticateToken, async (req, res) => {
  try {
    const { date_from, date_to, facility_type } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (date_from) {
      whereClauses.push('R.SUBMITTED_AT >= TO_DATE(:date_from, \'YYYY-MM-DD\')');
      binds.date_from = date_from;
    }
    if (date_to) {
      whereClauses.push('R.SUBMITTED_AT <= TO_DATE(:date_to, \'YYYY-MM-DD\')');
      binds.date_to = date_to;
    }
    if (facility_type) {
      whereClauses.push('F.FACILITY_TYPE = :facility_type');
      binds.facility_type = facility_type;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT F.SEVERITY_LEVEL, COUNT(*) as COUNT
      FROM FACILITY F
      JOIN REPORT R ON F.REPORT_ID = R.REPORT_ID
      ${whereClause}
      GROUP BY F.SEVERITY_LEVEL
      ORDER BY COUNT DESC
    `;
    
    const result = await exec(sql, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Get facilities by severity error:', err);
    res.status(500).json({ error: 'Failed to get facilities by severity', details: err.message });
  }
});

// GET /api/facilities/:reportId
router.get('/:reportId', authenticateToken, async (req, res) => {
  try {
    const result = await exec(
      `SELECT * FROM FACILITY WHERE REPORT_ID = :report_id`,
      { report_id: req.params.reportId }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get facility error:', err);
    res.status(500).json({ error: 'Failed to get facility', details: err.message });
  }
});

// PUT /api/facilities/:reportId
router.put('/:reportId', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const fields = Object.keys(data).filter(k => k !== 'report_id');
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updates = fields.map((f, i) => `${f.toUpperCase()} = :v${i}`);
    const binds = {};
    fields.forEach((f, i) => binds[`v${i}`] = data[f]);
    binds.report_id = req.params.reportId;

    const sql = `UPDATE FACILITY SET ${updates.join(', ')} WHERE REPORT_ID = :report_id`;
    await exec(sql, binds, { autoCommit: true });

    res.json({ message: 'Facility updated successfully' });
  } catch (err) {
    console.error('Update facility error:', err);
    res.status(500).json({ error: 'Failed to update facility', details: err.message });
  }
});

// DELETE /api/facilities/:reportId
router.delete('/:reportId', authenticateToken, async (req, res) => {
  try {
    await exec(
      `DELETE FROM FACILITY WHERE REPORT_ID = :report_id`,
      { report_id: req.params.reportId },
      { autoCommit: true }
    );
    res.json({ message: 'Facility deleted successfully' });
  } catch (err) {
    console.error('Delete facility error:', err);
    res.status(500).json({ error: 'Failed to delete facility', details: err.message });
  }
});

module.exports = router;
