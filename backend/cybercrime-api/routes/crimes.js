const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/crimes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await exec(`SELECT * FROM CRIME ORDER BY REPORT_ID DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('Get crimes error:', err);
    res.status(500).json({ error: 'Failed to get crimes', details: err.message });
  }
});

// POST /api/crimes
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      report_id, crime_category, suspect_description, victim_involved, 
      injury_level, weapon_involved, evidence_details 
    } = req.body;

    if (!report_id || !crime_category) {
      return res.status(400).json({ error: 'Report ID and crime category are required' });
    }

    const sql = `
      INSERT INTO CRIME (
        REPORT_ID, CRIME_CATEGORY, SUSPECT_DESCRIPTION, VICTIM_INVOLVED, 
        INJURY_LEVEL, WEAPON_INVOLVED, EVIDENCE_DETAILS
      ) VALUES (
        :report_id, :crime_category, :suspect_description, :victim_involved,
        :injury_level, :weapon_involved, :evidence_details
      )
    `;

    await exec(sql, {
      report_id,
      crime_category,
      suspect_description: suspect_description || null,
      victim_involved: victim_involved || null,
      injury_level: injury_level || null,
      weapon_involved: weapon_involved || null,
      evidence_details: evidence_details || null
    }, { autoCommit: true });

    res.status(201).json({ message: 'Crime record created successfully' });
  } catch (err) {
    console.error('Create crime error:', err);
    res.status(500).json({ error: 'Failed to create crime record', details: err.message });
  }
});

// GET /api/crimes/my-reports
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT C.*, R.TITLE, R.LOCATION, R.STATUS, R.SUBMITTED_AT
      FROM CRIME C
      JOIN REPORT R ON C.REPORT_ID = R.REPORT_ID
      WHERE R.SUBMITTED_BY = :user_id
      ORDER BY R.SUBMITTED_AT DESC
    `;
    
    const result = await exec(sql, { user_id: req.user.accountId });
    
    // Manual serialization to avoid circular references
    const cleanRows = result.rows.map(row => {
      const cleanRow = {};
      // Extract only the data we need
      Object.keys(row).forEach(key => {
        // Skip any Oracle-specific objects
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
    console.error('Get my crimes error:', err);
    res.status(500).json({ error: 'Failed to get crimes', details: err.message });
  }
});

// GET /api/crimes/by-category
router.get('/by-category', authenticateToken, async (req, res) => {
  try {
    const { date_from, date_to } = req.query;
    
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

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT C.CRIME_CATEGORY, COUNT(*) as COUNT
      FROM CRIME C
      JOIN REPORT R ON C.REPORT_ID = R.REPORT_ID
      ${whereClause}
      GROUP BY C.CRIME_CATEGORY
      ORDER BY COUNT DESC
    `;
    
    const result = await exec(sql, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Get crimes by category error:', err);
    res.status(500).json({ error: 'Failed to get crimes by category', details: err.message });
  }
});

// GET /api/crimes/report/:reportId
router.get('/report/:reportId', authenticateToken, async (req, res) => {
  try {
    const result = await exec(
      `SELECT * FROM CRIME WHERE REPORT_ID = :report_id`,
      { report_id: req.params.reportId }
    );
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
    console.error('Get crime error:', err);
    res.status(500).json({ error: 'Failed to get crime', details: err.message });
  }
});

// PUT /api/crimes/:reportId
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

    const sql = `UPDATE CRIME SET ${updates.join(', ')} WHERE REPORT_ID = :report_id`;
    await exec(sql, binds, { autoCommit: true });

    res.json({ message: 'Crime updated successfully' });
  } catch (err) {
    console.error('Update crime error:', err);
    res.status(500).json({ error: 'Failed to update crime', details: err.message });
  }
});

// DELETE /api/crimes/:reportId
router.delete('/:reportId', authenticateToken, async (req, res) => {
  try {
    await exec(
      `DELETE FROM CRIME WHERE REPORT_ID = :report_id`,
      { report_id: req.params.reportId },
      { autoCommit: true }
    );
    res.json({ message: 'Crime deleted successfully' });
  } catch (err) {
    console.error('Delete crime error:', err);
    res.status(500).json({ error: 'Failed to delete crime', details: err.message });
  }
});

module.exports = router;
