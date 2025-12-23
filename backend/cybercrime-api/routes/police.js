const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/police
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { state } = req.query;
    
    let whereClause = '';
    const binds = {};

    if (state) {
      whereClause = 'WHERE STATE = :state';
      binds.state = state;
    }
    
    const sql = `
      SELECT EMERGENCY_ID, CAMPUS, STATE, ADDRESS, PHONE, HOTLINE, EMAIL, 
             OPERATING_HOURS, CREATED_AT, UPDATED_AT
      FROM EMERGENCY_INFO
      ${whereClause}
      ORDER BY STATE, CAMPUS
    `;
    
    const result = await exec(sql, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Get police stations error:', err);
    res.status(500).json({ error: 'Failed to get police stations', details: err.message });
  }
});

// POST /api/police
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { campus, state, address, phone, hotline, email, operating_hours } = req.body;
    
    if (!campus || !state || !address || !phone || !hotline) {
      return res.status(400).json({ error: 'Campus, state, address, phone, and hotline are required' });
    }

    const sql = `
      INSERT INTO EMERGENCY_INFO (
        EMERGENCY_ID, CAMPUS, STATE, ADDRESS, PHONE, HOTLINE, EMAIL, 
        OPERATING_HOURS, CREATED_AT, UPDATED_AT
      ) VALUES (
        emergency_seq.NEXTVAL, :campus, :state, :address, :phone, :hotline, :email,
        :operating_hours, SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING EMERGENCY_ID INTO :id
    `;
    
    const binds = {
      campus,
      state,
      address,
      phone,
      hotline,
      email: email || null,
      operating_hours: operating_hours || '24 Hours',
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
    res.status(201).json({
      message: 'Police station created successfully',
      emergency_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create police station error:', err);
    res.status(500).json({ error: 'Failed to create police station', details: err.message });
  }
});

// GET /api/police/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const sql = `
      SELECT EMERGENCY_ID, CAMPUS, STATE, ADDRESS, PHONE, HOTLINE, EMAIL,
             OPERATING_HOURS, CREATED_AT, UPDATED_AT
      FROM EMERGENCY_INFO
      WHERE EMERGENCY_ID = :id
    `;
    
    const result = await exec(sql, { id: req.params.id });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Police station not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get police station error:', err);
    res.status(500).json({ error: 'Failed to get police station', details: err.message });
  }
});

// PUT /api/police/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { campus, state, address, phone, hotline, email, operating_hours } = req.body;
    
    const updates = [];
    const binds = { id: req.params.id };
    
    if (campus) {
      updates.push('CAMPUS = :campus');
      binds.campus = campus;
    }
    if (state) {
      updates.push('STATE = :state');
      binds.state = state;
    }
    if (address) {
      updates.push('ADDRESS = :address');
      binds.address = address;
    }
    if (phone) {
      updates.push('PHONE = :phone');
      binds.phone = phone;
    }
    if (hotline) {
      updates.push('HOTLINE = :hotline');
      binds.hotline = hotline;
    }
    if (email !== undefined) {
      updates.push('EMAIL = :email');
      binds.email = email || null;
    }
    if (operating_hours) {
      updates.push('OPERATING_HOURS = :operating_hours');
      binds.operating_hours = operating_hours;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push('UPDATED_AT = SYSTIMESTAMP');
    
    const sql = `UPDATE EMERGENCY_INFO SET ${updates.join(', ')} WHERE EMERGENCY_ID = :id`;
    
    await exec(sql, binds, { autoCommit: true });
    
    res.json({ message: 'Police station updated successfully' });
  } catch (err) {
    console.error('Update police station error:', err);
    res.status(500).json({ error: 'Failed to update police station', details: err.message });
  }
});

// DELETE /api/police/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `DELETE FROM EMERGENCY_INFO WHERE EMERGENCY_ID = :id`;
    
    await exec(sql, { id: req.params.id }, { autoCommit: true });
    
    res.json({ message: 'Police station deleted successfully' });
  } catch (err) {
    console.error('Delete police station error:', err);
    res.status(500).json({ error: 'Failed to delete police station', details: err.message });
  }
});

module.exports = router;
