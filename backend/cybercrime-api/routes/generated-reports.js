const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/generated-reports
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, date_from, date_to } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (category) {
      whereClauses.push('REPORT_CATEGORY = :category');
      binds.category = category;
    }
    if (date_from) {
      whereClauses.push('REQUESTED_AT >= TO_TIMESTAMP(:date_from, \'YYYY-MM-DD\')');
      binds.date_from = date_from;
    }
    if (date_to) {
      whereClauses.push('REQUESTED_AT <= TO_TIMESTAMP(:date_to, \'YYYY-MM-DD\')');
      binds.date_to = date_to;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT gr.GENERATE_ID, gr.GENERATED_BY, gr.TITLE, gr.SUMMARY, 
             gr.DATE_RANGE_START, gr.DATE_RANGE_END, gr.REPORT_CATEGORY, 
             gr.REPORT_DATA_TYPE, gr.REQUESTED_AT,
             a.NAME as GENERATED_BY_NAME, a.EMAIL as GENERATED_BY_EMAIL
      FROM GENERATED_REPORT gr
      JOIN ACCOUNT a ON gr.GENERATED_BY = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY gr.REQUESTED_AT DESC
    `;
    
    const result = await exec(sql, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Get generated reports error:', err);
    res.status(500).json({ error: 'Failed to get generated reports', details: err.message });
  }
});

// POST /api/generated-reports
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      title, 
      summary, 
      date_range_start, 
      date_range_end, 
      report_category, 
      report_data_type, 
      report_data 
    } = req.body;
    
    if (!title || !summary || !date_range_start || !date_range_end || !report_category) {
      return res.status(400).json({ 
        error: 'Title, summary, date range, and category are required' 
      });
    }

    const sql = `
      INSERT INTO GENERATED_REPORT (
        GENERATE_ID, GENERATED_BY, TITLE, SUMMARY, DATE_RANGE_START, 
        DATE_RANGE_END, REPORT_CATEGORY, REPORT_DATA_TYPE, REPORT_DATA, REQUESTED_AT
      ) VALUES (
        generate_seq.NEXTVAL, :generated_by, :title, :summary, 
        TO_TIMESTAMP(:date_start, 'YYYY-MM-DD'), 
        TO_TIMESTAMP(:date_end, 'YYYY-MM-DD'),
        :category, :data_type, :data, SYSTIMESTAMP
      ) RETURNING GENERATE_ID INTO :id
    `;
    
    const binds = {
      generated_by: req.user.accountId,
      title,
      summary,
      date_start: date_range_start,
      date_end: date_range_end,
      category: report_category,
      data_type: report_data_type || 'JSON',
      data: report_data ? JSON.stringify(report_data) : null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
    res.status(201).json({
      message: 'Generated report created successfully',
      generate_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create generated report error:', err);
    res.status(500).json({ error: 'Failed to create generated report', details: err.message });
  }
});

// GET /api/generated-reports/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT gr.GENERATE_ID, gr.GENERATED_BY, gr.TITLE, gr.SUMMARY, 
             gr.DATE_RANGE_START, gr.DATE_RANGE_END, gr.REPORT_CATEGORY, 
             gr.REPORT_DATA_TYPE, gr.REPORT_DATA, gr.REQUESTED_AT,
             a.NAME as GENERATED_BY_NAME, a.EMAIL as GENERATED_BY_EMAIL
      FROM GENERATED_REPORT gr
      JOIN ACCOUNT a ON gr.GENERATED_BY = a.ACCOUNT_ID
      WHERE gr.GENERATE_ID = :id
    `;
    
    const result = await exec(sql, { id: req.params.id });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Generated report not found' });
    }
    
    const report = result.rows[0];
    
    // Parse JSON data if present
    if (report.REPORT_DATA) {
      try {
        report.REPORT_DATA = JSON.parse(report.REPORT_DATA);
      } catch (e) {
        // Keep as string if not valid JSON
      }
    }
    
    res.json(report);
  } catch (err) {
    console.error('Get generated report error:', err);
    res.status(500).json({ error: 'Failed to get generated report', details: err.message });
  }
});

// DELETE /api/generated-reports/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `DELETE FROM GENERATED_REPORT WHERE GENERATE_ID = :id`;
    
    await exec(sql, { id: req.params.id }, { autoCommit: true });
    
    res.json({ message: 'Generated report deleted successfully' });
  } catch (err) {
    console.error('Delete generated report error:', err);
    res.status(500).json({ error: 'Failed to delete generated report', details: err.message });
  }
});

module.exports = router;
