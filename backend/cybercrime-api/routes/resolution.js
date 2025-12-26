const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { toPlainRows } = require('../helper/toPlainRows');
const router = express.Router();

// GET /api/resolutions - Get all resolutions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { resolution_type, report_id, resolved_by, page = 1, limit = 10 } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (resolution_type) {
      whereClauses.push('RESOLUTION_TYPE = :resolution_type');
      binds.resolution_type = resolution_type;
    }
    if (report_id) {
      whereClauses.push('REPORT_ID = :report_id');
      binds.report_id = report_id;
    }
    if (resolved_by) {
      whereClauses.push('RESOLVED_BY = :resolved_by');
      binds.resolved_by = resolved_by;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT 
        RES.RESOLUTION_ID, 
        RES.REPORT_ID, 
        RES.RESOLVED_BY, 
        RES.RESOLUTION_TYPE, 
        RES.RESOLUTION_SUMMARY, 
        RES.EVIDENCE_PATH, 
        RES.RESOLVED_AT,
        REP.TITLE as REPORT_TITLE,
        REP.TYPE as REPORT_TYPE,
        ACC.NAME as RESOLVER_NAME
      FROM RESOLUTION RES
      JOIN REPORT REP ON RES.REPORT_ID = REP.REPORT_ID
      JOIN ACCOUNT ACC ON RES.RESOLVED_BY = ACC.ACCOUNT_ID
      ${whereClause} 
      ORDER BY RES.RESOLVED_AT DESC
    `;
    
    const result = await exec(sql, binds);
    const resolutions = toPlainRows(result.rows);
    
    res.json({ resolutions, total: resolutions.length });
  } catch (err) {
    console.error('Get resolutions error:', err);
    res.status(500).json({ error: 'Failed to get resolutions', details: err.message });
  }
});

// POST /api/resolutions - Create a new resolution
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { report_id, resolution_type, resolution_summary, evidence_path } = req.body;
    
    if (!report_id || !resolution_type || !resolution_summary) {
      return res.status(400).json({ 
        error: 'Report ID, resolution type, and resolution summary are required' 
      });
    }

    // Validate resolution type
    const validTypes = ['RESOLVED', 'ESCALATED', 'DISMISSED', 'TRANSFERRED'];
    if (!validTypes.includes(resolution_type)) {
      return res.status(400).json({ 
        error: 'Invalid resolution type. Must be one of: RESOLVED, ESCALATED, DISMISSED, TRANSFERRED' 
      });
    }

    // Check if report exists
    const reportCheck = await exec(
      `SELECT REPORT_ID, STATUS FROM REPORT WHERE REPORT_ID = :report_id`,
      { report_id }
    );

    if (reportCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const sql = `
      INSERT INTO RESOLUTION (
        RESOLUTION_ID, REPORT_ID, RESOLVED_BY, RESOLUTION_TYPE, 
        RESOLUTION_SUMMARY, EVIDENCE_PATH, RESOLVED_AT
      ) VALUES (
        resolution_seq.NEXTVAL, :report_id, :resolved_by, :resolution_type, 
        :resolution_summary, :evidence_path, SYSTIMESTAMP
      ) RETURNING RESOLUTION_ID INTO :id
    `;
        const userId = req.user.accountId || req.user.ACCOUNT_ID || req.user.id;
    const binds = {
      report_id,
      resolved_by: userId,
      resolution_type,
      resolution_summary,
      evidence_path: evidence_path || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
    // Update report status to RESOLVED if resolution type is RESOLVED
    if (resolution_type === 'RESOLVED') {
      await exec(
        `UPDATE REPORT SET STATUS = 'RESOLVED', UPDATED_AT = SYSTIMESTAMP WHERE REPORT_ID = :report_id`,
        { report_id },
        { autoCommit: true }
      );
    }

    await exec('COMMIT', {}, { autoCommit: true });

    res.status(201).json({
      message: 'Resolution created successfully',
      resolution_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create resolution error:', err);
    await exec('ROLLBACK', {}, { autoCommit: true }).catch(() => {});
    res.status(500).json({ error: 'Failed to create resolution', details: err.message });
  }
});

// GET /api/resolutions/by-report/:report_id - Get resolutions for a specific report
router.get('/by-report/:report_id', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT 
        RES.*,
        ACC.NAME as RESOLVER_NAME,
        ACC.EMAIL as RESOLVER_EMAIL
      FROM RESOLUTION RES
      JOIN ACCOUNT ACC ON RES.RESOLVED_BY = ACC.ACCOUNT_ID
      WHERE RES.REPORT_ID = :report_id
      ORDER BY RES.RESOLVED_AT DESC
    `;
    
    const result = await exec(sql, { report_id: req.params.report_id });
    const resolutions = toPlainRows(result.rows);
    
    res.json({ resolutions, total: resolutions.length });
  } catch (err) {
    console.error('Get resolutions by report error:', err);
    res.status(500).json({ error: 'Failed to get resolutions', details: err.message });
  }
});

// GET /api/resolutions/my-resolutions - Get resolutions created by current user
router.get('/my-resolutions', authenticateToken, async (req, res) => {
  try {
    const { resolution_type, date_from, date_to } = req.query;
    
    let whereClauses = ['RES.RESOLVED_BY = :resolved_by'];
    const binds = { resolved_by: req.user.accountId };

    if (resolution_type) {
      whereClauses.push('RES.RESOLUTION_TYPE = :resolution_type');
      binds.resolution_type = resolution_type;
    }
    if (date_from) {
      whereClauses.push('RES.RESOLVED_AT >= TO_DATE(:date_from, \'YYYY-MM-DD\')');
      binds.date_from = date_from;
    }
    if (date_to) {
      whereClauses.push('RES.RESOLVED_AT <= TO_DATE(:date_to, \'YYYY-MM-DD\')');
      binds.date_to = date_to;
    }

    const whereClause = whereClauses.join(' AND ');
    
    const sql = `
      SELECT 
        RES.*,
        REP.TITLE as REPORT_TITLE,
        REP.TYPE as REPORT_TYPE,
        REP.STATUS as REPORT_STATUS
      FROM RESOLUTION RES
      JOIN REPORT REP ON RES.REPORT_ID = REP.REPORT_ID
      WHERE ${whereClause} 
      ORDER BY RES.RESOLVED_AT DESC
    `;
    
    const result = await exec(sql, binds);
    const resolutions = toPlainRows(result.rows);
    
    res.json({ resolutions, total: resolutions.length });
  } catch (err) {
    console.error('Get my resolutions error:', err);
    res.status(500).json({ error: 'Failed to get resolutions', details: err.message });
  }
});

// GET /api/resolutions/statistics - Get resolution statistics
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const { date_from, date_to } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (date_from) {
      whereClauses.push('RESOLVED_AT >= TO_DATE(:date_from, \'YYYY-MM-DD\')');
      binds.date_from = date_from;
    }
    if (date_to) {
      whereClauses.push('RESOLVED_AT <= TO_DATE(:date_to, \'YYYY-MM-DD\')');
      binds.date_to = date_to;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    // Get statistics by resolution type
    const typeStatsSql = `
      SELECT RESOLUTION_TYPE, COUNT(*) as COUNT 
      FROM RESOLUTION ${whereClause}
      GROUP BY RESOLUTION_TYPE
      ORDER BY COUNT DESC
    `;
    
    // Get statistics by resolver
    const resolverStatsSql = `
      SELECT 
        ACC.NAME as RESOLVER_NAME,
        COUNT(*) as RESOLUTION_COUNT
      FROM RESOLUTION RES
      JOIN ACCOUNT ACC ON RES.RESOLVED_BY = ACC.ACCOUNT_ID
      ${whereClause}
      GROUP BY ACC.NAME
      ORDER BY RESOLUTION_COUNT DESC
    `;
    
    // Get total count
    const totalSql = `SELECT COUNT(*) as TOTAL FROM RESOLUTION ${whereClause}`;
    
    const [typeStats, resolverStats, totalCount] = await Promise.all([
      exec(typeStatsSql, binds),
      exec(resolverStatsSql, binds),
      exec(totalSql, binds)
    ]);
    
    res.json({
      total: toPlainRows(totalCount.rows)[0]?.TOTAL || 0,
      by_type: toPlainRows(typeStats.rows),
      by_resolver: toPlainRows(resolverStats.rows)
    });
  } catch (err) {
    console.error('Get resolution statistics error:', err);
    res.status(500).json({ error: 'Failed to get statistics', details: err.message });
  }
});

// GET /api/resolutions/search - Search resolutions
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, resolution_type, date_from, date_to } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (q) {
      whereClauses.push('(UPPER(RES.RESOLUTION_SUMMARY) LIKE :q OR UPPER(REP.TITLE) LIKE :q)');
      binds.q = `%${q.toUpperCase()}%`;
    }
    if (resolution_type) {
      whereClauses.push('RES.RESOLUTION_TYPE = :resolution_type');
      binds.resolution_type = resolution_type;
    }
    if (date_from) {
      whereClauses.push('RES.RESOLVED_AT >= TO_DATE(:date_from, \'YYYY-MM-DD\')');
      binds.date_from = date_from;
    }
    if (date_to) {
      whereClauses.push('RES.RESOLVED_AT <= TO_DATE(:date_to, \'YYYY-MM-DD\')');
      binds.date_to = date_to;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT 
        RES.*,
        REP.TITLE as REPORT_TITLE,
        REP.TYPE as REPORT_TYPE,
        ACC.NAME as RESOLVER_NAME
      FROM RESOLUTION RES
      JOIN REPORT REP ON RES.REPORT_ID = REP.REPORT_ID
      JOIN ACCOUNT ACC ON RES.RESOLVED_BY = ACC.ACCOUNT_ID
      ${whereClause} 
      ORDER BY RES.RESOLVED_AT DESC
    `;
    
    const result = await exec(sql, binds);
    const resolutions = toPlainRows(result.rows);
    
    res.json({ resolutions, total: resolutions.length });
  } catch (err) {
    console.error('Search resolutions error:', err);
    res.status(500).json({ error: 'Failed to search resolutions', details: err.message });
  }
});

// GET /api/resolutions/:id - Get a specific resolution
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT 
        RES.*,
        REP.TITLE as REPORT_TITLE,
        REP.DESCRIPTION as REPORT_DESCRIPTION,
        REP.TYPE as REPORT_TYPE,
        REP.STATUS as REPORT_STATUS,
        REP.LOCATION as REPORT_LOCATION,
        ACC.NAME as RESOLVER_NAME,
        ACC.EMAIL as RESOLVER_EMAIL,
        SUB.NAME as SUBMITTER_NAME
      FROM RESOLUTION RES
      JOIN REPORT REP ON RES.REPORT_ID = REP.REPORT_ID
      JOIN ACCOUNT ACC ON RES.RESOLVED_BY = ACC.ACCOUNT_ID
      JOIN ACCOUNT SUB ON REP.SUBMITTED_BY = SUB.ACCOUNT_ID
      WHERE RES.RESOLUTION_ID = :id
    `;
    
    const result = await exec(sql, { id: req.params.id });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resolution not found' });
    }
    
    const resolution = toPlainRows(result.rows)[0];
    res.json(resolution);
  } catch (err) {
    console.error('Get resolution error:', err);
    res.status(500).json({ error: 'Failed to get resolution', details: err.message });
  }
});

// PUT /api/resolutions/:id - Update a resolution
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { resolution_type, resolution_summary, evidence_path } = req.body;
    
    // Check if resolution exists
    const checkResult = await exec(
      `SELECT RESOLVED_BY FROM RESOLUTION WHERE RESOLUTION_ID = :id`,
      { id: req.params.id }
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Resolution not found' });
    }

    const fields = [];
    const binds = { id: req.params.id };

    if (resolution_type !== undefined) {
      const validTypes = ['RESOLVED', 'ESCALATED', 'DISMISSED', 'TRANSFERRED'];
      if (!validTypes.includes(resolution_type)) {
        return res.status(400).json({ 
          error: 'Invalid resolution type. Must be one of: RESOLVED, ESCALATED, DISMISSED, TRANSFERRED' 
        });
      }
      fields.push('RESOLUTION_TYPE = :resolution_type');
      binds.resolution_type = resolution_type;
    }
    if (resolution_summary !== undefined) {
      fields.push('RESOLUTION_SUMMARY = :resolution_summary');
      binds.resolution_summary = resolution_summary;
    }
    if (evidence_path !== undefined) {
      fields.push('EVIDENCE_PATH = :evidence_path');
      binds.evidence_path = evidence_path;
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const sql = `UPDATE RESOLUTION SET ${fields.join(', ')} WHERE RESOLUTION_ID = :id`;
    await exec(sql, binds, { autoCommit: true });

    res.json({ message: 'Resolution updated successfully' });
  } catch (err) {
    console.error('Update resolution error:', err);
    res.status(500).json({ error: 'Failed to update resolution', details: err.message });
  }
});

// DELETE /api/resolutions/:id - Delete a resolution
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if resolution exists
    const checkResult = await exec(
      `SELECT RESOLUTION_ID FROM RESOLUTION WHERE RESOLUTION_ID = :id`,
      { id: req.params.id }
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Resolution not found' });
    }

    await exec(
      `DELETE FROM RESOLUTION WHERE RESOLUTION_ID = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    
    res.json({ message: 'Resolution deleted successfully' });
  } catch (err) {
    console.error('Delete resolution error:', err);
    res.status(500).json({ error: 'Failed to delete resolution', details: err.message });
  }
});

module.exports = router;
