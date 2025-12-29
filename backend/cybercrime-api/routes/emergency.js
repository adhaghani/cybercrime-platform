const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/emergency
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { state, type } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (state) {
      whereClauses.push('STATE = :state');
      binds.state = state;
    }
    if (type) {
      whereClauses.push('TYPE = :type');
      binds.type = type;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` + ` AND TYPE IS NOT NULL ` : 'WHERE TYPE IS NOT NULL ';
    
    const sql = `
      SELECT EMERGENCY_ID, NAME, ADDRESS, PHONE, EMAIL, STATE, TYPE, HOTLINE, 
             CREATED_AT, UPDATED_AT
      FROM EMERGENCY_INFO
      ${whereClause}
      ORDER BY STATE, NAME
    `;
    
    const result = await exec(sql, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Get emergency contacts error:', err);
    res.status(500).json({ error: 'Failed to get emergency contacts', details: err.message });
  }
});

// POST /api/emergency
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, address, phone, email, state, type, hotline } = req.body;
    
    if (!name || !address || !phone || !state || !type) {
      return res.status(400).json({ error: 'Name, address, phone, state, and type are required' });
    }

    const sql = `
      INSERT INTO EMERGENCY_INFO (
        EMERGENCY_ID, NAME, ADDRESS, PHONE, EMAIL, STATE, TYPE, HOTLINE,
        CREATED_AT, UPDATED_AT
      ) VALUES (
        emergency_seq.NEXTVAL, :name, :address, :phone, :email, :state, :type, :hotline,
        SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING EMERGENCY_ID INTO :id
    `;
    
    const binds = {
      name,
      address,
      phone,
      email: email || null,
      state,
      type: type || 'Police',
      hotline: hotline || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
    res.status(201).json({
      message: 'Emergency contact created successfully',
      emergency_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create emergency contact error:', err);
    res.status(500).json({ error: 'Failed to create emergency contact', details: err.message });
  }
});

// GET /api/emergency/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const sql = `
      SELECT EMERGENCY_ID, NAME, ADDRESS, PHONE, EMAIL, STATE, TYPE, HOTLINE,
             CREATED_AT, UPDATED_AT
      FROM EMERGENCY_INFO
      WHERE EMERGENCY_ID = :id
    `;
    
    const result = await exec(sql, { id: req.params.id });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Emergency contact not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get emergency contact error:', err);
    res.status(500).json({ error: 'Failed to get emergency contact', details: err.message });
  }
});

// PUT /api/emergency/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, address, phone, email, state, type, hotline } = req.body;
    
    const updates = [];
    const binds = { id: req.params.id };
    
    if (name) {
      updates.push('NAME = :name');
      binds.name = name;
    }
    if (address) {
      updates.push('ADDRESS = :address');
      binds.address = address;
    }
    if (phone) {
      updates.push('PHONE = :phone');
      binds.phone = phone;
    }
    if (email !== undefined) {
      updates.push('EMAIL = :email');
      binds.email = email || null;
    }
    if (state) {
      updates.push('STATE = :state');
      binds.state = state;
    }
    if (type) {
      updates.push('TYPE = :type');
      binds.type = type;
    }
    if (hotline !== undefined) {
      updates.push('HOTLINE = :hotline');
      binds.hotline = hotline || null;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push('UPDATED_AT = SYSTIMESTAMP');
    
    const sql = `UPDATE EMERGENCY_INFO SET ${updates.join(', ')} WHERE EMERGENCY_ID = :id`;
    
    await exec(sql, binds, { autoCommit: true });
    
    res.json({ message: 'Emergency contact updated successfully' });
  } catch (err) {
    console.error('Update emergency contact error:', err);
    res.status(500).json({ error: 'Failed to update emergency contact', details: err.message });
  }
});

// DELETE /api/emergency/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `DELETE FROM EMERGENCY_INFO WHERE EMERGENCY_ID = :id`;
    
    await exec(sql, { id: req.params.id }, { autoCommit: true });
    
    res.json({ message: 'Emergency contact deleted successfully' });
  } catch (err) {
    console.error('Delete emergency contact error:', err);
    res.status(500).json({ error: 'Failed to delete emergency contact', details: err.message });
  }
});

// GET /api/emergency/public/all - Public endpoint for emergency contacts
router.get('/public/all', async (req, res) => {
  try {
    const sql = `
      SELECT 
        EMERGENCY_ID, 
        NAME, 
        ADDRESS, 
        PHONE, 
        EMAIL, 
        STATE, 
        TYPE, 
        HOTLINE
      FROM EMERGENCY_INFO
      WHERE TYPE IS NOT NULL
      ORDER BY TYPE, STATE, NAME
    `;
    
    const result = await exec(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Get public emergency contacts error:', err);
    res.status(500).json({ error: 'Failed to get emergency contacts', details: err.message });
  }
});

module.exports = router;
