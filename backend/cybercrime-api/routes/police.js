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
      whereClause = 'WHERE e.STATE = :state';
      binds.state = state;
    }
    
    const sql = `
      SELECT e.EMERGENCY_ID, p.CAMPUS, e.STATE, e.ADDRESS, 
             e.PHONE, e.HOTLINE, e.EMAIL, p.OPERATING_HOURS,
             e.CREATED_AT, e.UPDATED_AT
      FROM UITM_AUXILIARY_POLICE p
      INNER JOIN EMERGENCY_INFO e ON p.EMERGENCY_ID = e.EMERGENCY_ID
      ${whereClause}
      ORDER BY e.STATE, p.CAMPUS
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

    // First, insert into EMERGENCY_INFO
    const emergencySql = `
      INSERT INTO EMERGENCY_INFO (
        EMERGENCY_ID, STATE, ADDRESS, PHONE, HOTLINE, EMAIL, 
        CREATED_AT, UPDATED_AT
      ) VALUES (
        emergency_seq.NEXTVAL, :state, :address, :phone, :hotline, :email,
        SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING EMERGENCY_ID INTO :id
    `;
    
    const emergencyBinds = {
      state,
      address,
      phone,
      hotline,
      email: email || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const emergencyResult = await exec(emergencySql, emergencyBinds, { autoCommit: true });
    const emergencyId = emergencyResult.outBinds.id[0];

    // Then, insert into UITM_AUXILIARY_POLICE table
    const policeSql = `
      INSERT INTO UITM_AUXILIARY_POLICE (
        EMERGENCY_ID, CAMPUS, OPERATING_HOURS
      ) VALUES (
        :emergency_id, :campus, :operating_hours
      )
    `;
    
    const policeBinds = {
      emergency_id: emergencyId,
      campus,
      operating_hours: operating_hours || '24 Hours'
    };

    await exec(policeSql, policeBinds, { autoCommit: true });
    
    res.status(201).json({
      message: 'Police station created successfully',
      emergency_id: emergencyId
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
      SELECT e.EMERGENCY_ID, p.CAMPUS, e.STATE, e.ADDRESS, 
             e.PHONE, e.HOTLINE, e.EMAIL, p.OPERATING_HOURS,
             e.CREATED_AT, e.UPDATED_AT
      FROM UITM_AUXILIARY_POLICE p
      INNER JOIN EMERGENCY_INFO e ON p.EMERGENCY_ID = e.EMERGENCY_ID
      WHERE e.EMERGENCY_ID = :id
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
    
    // Check if police station exists
    const checkSql = 'SELECT EMERGENCY_ID FROM UITM_AUXILIARY_POLICE WHERE EMERGENCY_ID = :id';
    const checkResult = await exec(checkSql, { id: req.params.id });
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Police station not found' });
    }
    
    // Update EMERGENCY_INFO table
    const emergencyUpdates = [];
    const emergencyBinds = { id: req.params.id };
    
    if (state) {
      emergencyUpdates.push('STATE = :state');
      emergencyBinds.state = state;
    }
    if (address) {
      emergencyUpdates.push('ADDRESS = :address');
      emergencyBinds.address = address;
    }
    if (phone) {
      emergencyUpdates.push('PHONE = :phone');
      emergencyBinds.phone = phone;
    }
    if (hotline) {
      emergencyUpdates.push('HOTLINE = :hotline');
      emergencyBinds.hotline = hotline;
    }
    if (email !== undefined) {
      emergencyUpdates.push('EMAIL = :email');
      emergencyBinds.email = email || null;
    }
    
    if (emergencyUpdates.length > 0) {
      emergencyUpdates.push('UPDATED_AT = SYSTIMESTAMP');
      const emergencySql = `UPDATE EMERGENCY_INFO SET ${emergencyUpdates.join(', ')} WHERE EMERGENCY_ID = :id`;
      await exec(emergencySql, emergencyBinds, { autoCommit: false });
    }
    
    // Update POLICE table
    const policeUpdates = [];
    const policeBinds = { id: req.params.id };
    
    if (campus) {
      policeUpdates.push('CAMPUS = :campus');
      policeBinds.campus = campus;
    }
    if (operating_hours) {
      policeUpdates.push('OPERATING_HOURS = :operating_hours');
      policeBinds.operating_hours = operating_hours;
    }
    
    if (policeUpdates.length > 0) {
      const policeSql = `UPDATE UITM_AUXILIARY_POLICE SET ${policeUpdates.join(', ')} WHERE EMERGENCY_ID = :id`;
      await exec(policeSql, policeBinds, { autoCommit: true });
    } else if (emergencyUpdates.length > 0) {
      // Commit emergency updates if no police updates
      await exec('COMMIT', {}, { autoCommit: true });
    }
    
    if (emergencyUpdates.length === 0 && policeUpdates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    res.json({ message: 'Police station updated successfully' });
  } catch (err) {
    console.error('Update police station error:', err);
    res.status(500).json({ error: 'Failed to update police station', details: err.message });
  }
});

// DELETE /api/police/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if exists
    const checkSql = 'SELECT EMERGENCY_ID FROM UITM_AUXILIARY_POLICE WHERE EMERGENCY_ID = :id';
    const checkResult = await exec(checkSql, { id: req.params.id });
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Police station not found' });
    }
    
    // Delete from UITM_AUXILIARY_POLICE table first
    const deletePoliceSql = `DELETE FROM UITM_AUXILIARY_POLICE WHERE EMERGENCY_ID = :id`;
    await exec(deletePoliceSql, { id: req.params.id }, { autoCommit: false });
    
    // Then delete from EMERGENCY_INFO (CASCADE will handle this if FK is set up)
    const deleteEmergencySql = `DELETE FROM EMERGENCY_INFO WHERE EMERGENCY_ID = :id`;
    await exec(deleteEmergencySql, { id: req.params.id }, { autoCommit: true });
    
    res.json({ message: 'Police station deleted successfully' });
  } catch (err) {
    console.error('Delete police station error:', err);
    res.status(500).json({ error: 'Failed to delete police station', details: err.message });
  }
});

module.exports = router;
