const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/staff
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role, department, page = 1, limit = 100 } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (role) {
      whereClauses.push('s.ROLE = :role');
      binds.role = role;
    }
    if (department) {
      whereClauses.push('s.DEPARTMENT = :department');
      binds.department = department;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT s.ACCOUNT_ID, s.STAFF_ID, s.ROLE, s.DEPARTMENT, s.POSITION, 
             s.SUPERVISOR_ID, s.CREATED_AT, s.UPDATED_AT,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER,
             sup.NAME as SUPERVISOR_NAME
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      LEFT JOIN ACCOUNT sup ON s.SUPERVISOR_ID = sup.ACCOUNT_ID
      ${whereClause}
      ORDER BY s.CREATED_AT DESC
    `;
    
    const result = await exec(sql, binds);
    res.json({ staff: result.rows });
  } catch (err) {
    console.error('Get staff error:', err);
    res.status(500).json({ error: 'Failed to get staff', details: err.message });
  }
});

// POST /api/staff
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { account_id, role, department, position, supervisor_id } = req.body;
    
    if (!account_id || !role || !department || !position) {
      return res.status(400).json({ error: 'Account ID, role, department, and position are required' });
    }

    const sql = `
      INSERT INTO STAFF (
        STAFF_ID, ACCOUNT_ID, ROLE, DEPARTMENT, POSITION, SUPERVISOR_ID, 
        CREATED_AT, UPDATED_AT
      ) VALUES (
        staff_seq.NEXTVAL, :account_id, :role, :department, :position, :supervisor_id,
        SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING STAFF_ID INTO :id
    `;
    
    const binds = {
      account_id,
      role,
      department,
      position,
      supervisor_id: supervisor_id || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
    res.status(201).json({
      message: 'Staff record created successfully',
      staff_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create staff error:', err);
    res.status(500).json({ error: 'Failed to create staff record', details: err.message });
  }
});

// GET /api/staff/search
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, department, role, page = 1, limit = 20 } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (q) {
      whereClauses.push('(UPPER(a.NAME) LIKE :search OR UPPER(a.EMAIL) LIKE :search)');
      binds.search = `%${q.toUpperCase()}%`;
    }
    if (department) {
      whereClauses.push('s.DEPARTMENT = :department');
      binds.department = department;
    }
    if (role) {
      whereClauses.push('s.ROLE = :role');
      binds.role = role;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT s.ACCOUNT_ID, s.STAFF_ID, s.ROLE, s.DEPARTMENT, s.POSITION,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY a.NAME
    `;
    
    const result = await exec(sql, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Search staff error:', err);
    res.status(500).json({ error: 'Failed to search staff', details: err.message });
  }
});

// GET /api/staff/export
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const { format = 'csv', department, role } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (department) {
      whereClauses.push('s.DEPARTMENT = :department');
      binds.department = department;
    }
    if (role) {
      whereClauses.push('s.ROLE = :role');
      binds.role = role;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT s.STAFF_ID, a.NAME, a.EMAIL, a.CONTACT_NUMBER, s.ROLE, 
             s.DEPARTMENT, s.POSITION, s.CREATED_AT
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY a.NAME
    `;
    
    const result = await exec(sql, binds);
    
    if (format === 'csv') {
      const csv = [
        ['Staff ID', 'Name', 'Email', 'Contact', 'Role', 'Department', 'Position', 'Created At'],
        ...result.rows.map(row => [
          row.STAFF_ID,
          row.NAME,
          row.EMAIL,
          row.CONTACT_NUMBER || '',
          row.ROLE,
          row.DEPARTMENT,
          row.POSITION,
          row.CREATED_AT
        ])
      ].map(row => row.join(',')).join('\n');
      
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename=staff_export.csv');
      res.send(csv);
    } else {
      res.json(result.rows);
    }
  } catch (err) {
    console.error('Export staff error:', err);
    res.status(500).json({ error: 'Failed to export staff', details: err.message });
  }
});

// GET /api/staff/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT s.ACCOUNT_ID, s.STAFF_ID, s.ROLE, s.DEPARTMENT, s.POSITION, 
             s.SUPERVISOR_ID, s.CREATED_AT, s.UPDATED_AT,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER,
             sup.NAME as SUPERVISOR_NAME
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      LEFT JOIN ACCOUNT sup ON s.SUPERVISOR_ID = sup.ACCOUNT_ID
      WHERE s.ACCOUNT_ID = :id
    `;
    
    const result = await exec(sql, { id: req.params.id });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get staff error:', err);
    res.status(500).json({ error: 'Failed to get staff', details: err.message });
  }
});

// PUT /api/staff/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { role, department, position, supervisor_id } = req.body;
    
    const updates = [];
    const binds = { id: req.params.id };
    
    if (role) {
      updates.push('ROLE = :role');
      binds.role = role;
    }
    if (department) {
      updates.push('DEPARTMENT = :department');
      binds.department = department;
    }
    if (position) {
      updates.push('POSITION = :position');
      binds.position = position;
    }
    if (supervisor_id !== undefined) {
      updates.push('SUPERVISOR_ID = :supervisor_id');
      binds.supervisor_id = supervisor_id || null;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push('UPDATED_AT = SYSTIMESTAMP');
    
    const sql = `UPDATE STAFF SET ${updates.join(', ')} WHERE ACCOUNT_ID = :id`;
    
    await exec(sql, binds, { autoCommit: true });
    
    res.json({ message: 'Staff updated successfully' });
  } catch (err) {
    console.error('Update staff error:', err);
    res.status(500).json({ error: 'Failed to update staff', details: err.message });
  }
});

// DELETE /api/staff/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `DELETE FROM STAFF WHERE ACCOUNT_ID = :id`;
    
    await exec(sql, { id: req.params.id }, { autoCommit: true });
    
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    console.error('Delete staff error:', err);
    res.status(500).json({ error: 'Failed to delete staff', details: err.message });
  }
});

module.exports = router;
