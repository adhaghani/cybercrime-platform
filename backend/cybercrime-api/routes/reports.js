const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { toPlainRows } = require('../helper/toPlainRows');
const router = express.Router();

// GET /api/reports
router.get('/', authenticateToken, async (req, res) => {
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
    const { submitted_by, title, description, location, status, type, attachment_path } = req.body;
    
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
    
    res.status(201).json({
      message: 'Report created successfully',
      report_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create report error:', err);
    res.status(500).json({ error: 'Failed to create report', details: err.message });
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

    res.json(result.rows[0]);
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
