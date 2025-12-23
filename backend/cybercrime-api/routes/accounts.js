const express = require('express');
const bcrypt = require('bcryptjs');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/accounts
router.get('/', optionalAuth, async (req, res) => {
  try {
    const result = await exec(
      `SELECT ACCOUNT_ID, NAME, EMAIL, CONTACT_NUMBER, ACCOUNT_TYPE, CREATED_AT, UPDATED_AT 
       FROM ACCOUNT ORDER BY CREATED_AT DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get accounts error:', err);
    res.status(500).json({ error: 'Failed to get accounts', details: err.message });
  }
});

// POST /api/accounts
router.post('/', async (req, res) => {
  try {
    const { name, email, password, contact_number, account_type } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO ACCOUNT (
        ACCOUNT_ID, NAME, EMAIL, PASSWORD_HASH, CONTACT_NUMBER, 
        ACCOUNT_TYPE, CREATED_AT, UPDATED_AT
      ) VALUES (
        account_seq.NEXTVAL, :name, :email, :password, :contact, 
        :type, SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING ACCOUNT_ID INTO :id
    `;
    
    const binds = {
      name,
      email,
      password: hashedPassword,
      contact: contact_number || null,
      type: account_type || 'STUDENT',
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
    res.status(201).json({ 
      message: 'Account created',
      account_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create account error:', err);
    res.status(500).json({ error: 'Failed to create account', details: err.message });
  }
});

// GET /api/accounts/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await exec(
      `SELECT ACCOUNT_ID, NAME, EMAIL, CONTACT_NUMBER, ACCOUNT_TYPE, CREATED_AT, UPDATED_AT 
       FROM ACCOUNT WHERE ACCOUNT_ID = :id`,
      { id: req.params.id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get account error:', err);
    res.status(500).json({ error: 'Failed to get account', details: err.message });
  }
});

// PUT /api/accounts/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, contact_number, password } = req.body;
    const updates = [];
    const binds = { id: req.params.id };

    if (name) {
      updates.push('NAME = :name');
      binds.name = name;
    }
    if (email) {
      updates.push('EMAIL = :email');
      binds.email = email;
    }
    if (contact_number) {
      updates.push('CONTACT_NUMBER = :contact');
      binds.contact = contact_number;
    }
    if (password) {
      updates.push('PASSWORD_HASH = :password');
      binds.password = await bcrypt.hash(password, 10);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('UPDATED_AT = SYSTIMESTAMP');

    const sql = `UPDATE ACCOUNT SET ${updates.join(', ')} WHERE ACCOUNT_ID = :id`;
    await exec(sql, binds, { autoCommit: true });

    res.json({ message: 'Account updated successfully' });
  } catch (err) {
    console.error('Update account error:', err);
    res.status(500).json({ error: 'Failed to update account', details: err.message });
  }
});

// DELETE /api/accounts/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await exec(
      `DELETE FROM ACCOUNT WHERE ACCOUNT_ID = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Failed to delete account', details: err.message });
  }
});

module.exports = router;
