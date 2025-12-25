const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { toPlainRows } = require('../helper/toPlainRows');
const router = express.Router();



// GET /api/announcements
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await exec(
      `SELECT * FROM (
         SELECT a.*, ROW_NUMBER() OVER (ORDER BY CREATED_AT DESC) rn
         FROM ANNOUNCEMENT a
       ) WHERE rn > :offset AND rn <= :endRow`,
      { offset: parseInt(offset), endRow: parseInt(offset) + parseInt(limit) }
    );

    const announcements = toPlainRows(result.rows);
    res.json({ announcements, totalAnnouncement : announcements.length });
  } catch (err) {
    console.error('Get announcements error:', err);
    res.status(500).json({ error: 'Failed to get announcements', details: err.message });
  }
});

// POST /api/announcements
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Create announcement request body:', req.body);
    const { 
      title, message, audience, type, priority, status, 
      photo_path, start_date, end_date 
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const sql = `
      INSERT INTO ANNOUNCEMENT (
        ANNOUNCEMENT_ID, CREATED_BY, TITLE, MESSAGE, AUDIENCE, TYPE, 
        PRIORITY, STATUS, PHOTO_PATH, START_DATE, END_DATE, CREATED_AT, UPDATED_AT
      ) VALUES (
        announcement_seq.NEXTVAL, :created_by, :title, :message, :audience, :type,
        :priority, :status, :photo, TO_DATE(:start_date, 'YYYY-MM-DD'), 
        TO_DATE(:end_date, 'YYYY-MM-DD'), SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING ANNOUNCEMENT_ID INTO :id
    `;

    const binds = {
      created_by: req.user.ACCOUNT_ID,
      title,
      message,
      audience: audience || 'ALL',
      type: type || 'GENERAL',
      priority: priority || 'MEDIUM',
      status: status || 'PUBLISHED',
      photo: photo_path || null,
      start_date: start_date || new Date().toISOString().split('T')[0],
      end_date: end_date || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    console.log('SQL binds:', binds);

    const result = await exec(sql, binds, { autoCommit: true });

    console.log('Announcement created successfully:', result.outBinds.id[0]);

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create announcement error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Failed to create announcement', details: err.message });
  }
});

// GET /api/announcements/active
router.get('/active', optionalAuth, async (req, res) => {
  try {
    const result = await exec(
      `SELECT * FROM ANNOUNCEMENT 
       WHERE STATUS = 'PUBLISHED' 
       AND START_DATE <= SYSDATE 
       AND END_DATE >= SYSDATE
       ORDER BY PRIORITY DESC, CREATED_AT DESC`
    );
    res.json(toPlainRows(result.rows));
  } catch (err) {
    console.error('Get active announcements error:', err);
    res.status(500).json({ error: 'Failed to get active announcements', details: err.message });
  }
});

// GET /api/announcements/by-audience/:audience
router.get('/by-audience/:audience', optionalAuth, async (req, res) => {
  try {
    const result = await exec(
      `SELECT * FROM ANNOUNCEMENT 
       WHERE (AUDIENCE = :audience OR AUDIENCE = 'ALL')
       AND STATUS = 'PUBLISHED'
       ORDER BY CREATED_AT DESC`,
      { audience: req.params.audience }
    );
    res.json(toPlainRows(result.rows));
  } catch (err) {
    console.error('Get announcements by audience error:', err);
    res.status(500).json({ error: 'Failed to get announcements', details: err.message });
  }
});

// GET /api/announcements/search
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, priority, type, target_audience } = req.query;
    let whereClauses = [];
    const binds = {};

    if (q) {
      whereClauses.push('(UPPER(TITLE) LIKE :q OR UPPER(MESSAGE) LIKE :q)');
      binds.q = `%${q.toUpperCase()}%`;
    }
    if (priority) {
      whereClauses.push('PRIORITY = :priority');
      binds.priority = priority;
    }
    if (type) {
      whereClauses.push('TYPE = :type');
      binds.type = type;
    }
    if (target_audience) {
      whereClauses.push('(AUDIENCE = :audience OR AUDIENCE = \'ALL\')');
      binds.audience = target_audience;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `SELECT * FROM ANNOUNCEMENT ${whereClause} ORDER BY CREATED_AT DESC`;
    const result = await exec(sql, binds);

    res.json(toPlainRows(result.rows));
  } catch (err) {
    console.error('Search announcements error:', err);
    res.status(500).json({ error: 'Failed to search announcements', details: err.message });
  }
});

// POST /api/announcements/bulk-archive
router.post('/bulk-archive', authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'IDs array is required' });
    }

    const placeholders = ids.map((_, i) => `:id${i}`).join(',');
    const binds = {};
    ids.forEach((id, i) => binds[`id${i}`] = id);

    await exec(
      `UPDATE ANNOUNCEMENT SET STATUS = 'ARCHIVED', UPDATED_AT = SYSTIMESTAMP 
       WHERE ANNOUNCEMENT_ID IN (${placeholders})`,
      binds,
      { autoCommit: true }
    );

    res.json({ message: `${ids.length} announcements archived`, archived: ids.length });
  } catch (err) {
    console.error('Bulk archive error:', err);
    res.status(500).json({ error: 'Failed to archive announcements', details: err.message });
  }
});

// GET /api/announcements/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const result = await exec(
      `SELECT * FROM ANNOUNCEMENT WHERE ANNOUNCEMENT_ID = :id`,
      { id: req.params.id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    const [announcement] = toPlainRows(result.rows);
    res.json(announcement);
  } catch (err) {
    console.error('Get announcement error:', err);
    res.status(500).json({ error: 'Failed to get announcement', details: err.message });
  }
});

// PUT /api/announcements/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const fields = Object.keys(data).filter(k => k !== 'id');
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const dateFields = new Set(['start_date', 'end_date']);
    const binds = {};
    
    const updates = fields.map((f, i) => {
      const column = f.toUpperCase();
      binds[`v${i}`] = data[f];
      
      // Use TO_DATE for date fields, just like in INSERT
      if (dateFields.has(f)) {
        return `${column} = TO_DATE(:v${i}, 'YYYY-MM-DD')`;
      }
      
      return `${column} = :v${i}`;
    });

    binds.id = req.params.id;
    updates.push('UPDATED_AT = SYSTIMESTAMP');

    const sql = `UPDATE ANNOUNCEMENT SET ${updates.join(', ')} WHERE ANNOUNCEMENT_ID = :id`;
    await exec(sql, binds, { autoCommit: true });

    res.json({ message: 'Announcement updated successfully' });
  } catch (err) {
    console.error('Update announcement error:', err);
    res.status(500).json({ error: 'Failed to update announcement', details: err.message });
  }
});

// DELETE /api/announcements/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await exec(
      `DELETE FROM ANNOUNCEMENT WHERE ANNOUNCEMENT_ID = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error('Delete announcement error:', err);
    res.status(500).json({ error: 'Failed to delete announcement', details: err.message });
  }
});

module.exports = router;
