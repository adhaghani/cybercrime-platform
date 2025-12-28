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
      `SELECT a.ACCOUNT_ID,
              a.NAME,
              a.EMAIL,
              a.CONTACT_NUMBER,
              a.AVATAR_URL,
              a.ACCOUNT_TYPE,
              s.STUDENT_ID,
              f.STAFF_ID,
              a.CREATED_AT,
              a.UPDATED_AT
       FROM ACCOUNT a
       LEFT JOIN STUDENT s ON s.ACCOUNT_ID = a.ACCOUNT_ID
       LEFT JOIN STAFF f ON f.ACCOUNT_ID = a.ACCOUNT_ID
       ORDER BY a.CREATED_AT DESC`
    );

    const accounts = result.rows.map(row => {
      const account = {
        ACCOUNT_ID: row.ACCOUNT_ID,
        NAME: row.NAME,
        EMAIL: row.EMAIL,
        AVATAR_URL: row.AVATAR_URL,
        CONTACT_NUMBER: row.CONTACT_NUMBER,
        ACCOUNT_TYPE: row.ACCOUNT_TYPE,
        CREATED_AT: row.CREATED_AT,
        UPDATED_AT: row.UPDATED_AT
      };
      if (row.ACCOUNT_TYPE === 'STUDENT' && row.STUDENT_ID) {
        account.STUDENT_ID = row.STUDENT_ID;
      } else if (row.ACCOUNT_TYPE === 'STAFF' && row.STAFF_ID) {
        account.STAFF_ID = row.STAFF_ID;
      }
      return account;
    });
    res.json(accounts);
  } catch (err) {
    console.error('Get accounts error:', err);
    res.status(500).json({ error: 'Failed to get accounts', details: err.message });
  }
});

// GET /api/accounts/count
router.get('/count', async (req, res) => {
  try {
    const result = await exec(
      `SELECT 
        COUNT(*) AS TOTAL_ACCOUNTS,
        SUM(CASE WHEN ACCOUNT_TYPE = 'STAFF' THEN 1 ELSE 0 END) AS STAFF_COUNT,
        SUM(CASE WHEN ACCOUNT_TYPE = 'STUDENT' THEN 1 ELSE 0 END) AS STUDENT_COUNT
       FROM ACCOUNT`
    );
    const totalAccounts = result.rows[0].TOTAL_ACCOUNTS;
    const staffCount = result.rows[0].STAFF_COUNT;
    const studentCount = result.rows[0].STUDENT_COUNT;
    res.json({ totalAccounts, staffCount, studentCount });
  } catch (err) {
    console.error('Get accounts count error:', err);
    res.status(500).json({ error: 'Failed to get accounts count', details: err.message });
  }
}
);

// POST /api/accounts
// Create a new account
router.post('/', async (req, res) => {
  let connection;
  try {
    const { name, email, password, contact_number, account_type, studentID, program, semester, year_of_study, staffID, role, department, position, supervisorID } = req.body;
    
    if (!name || !email || !password || !account_type) {
      return res.status(400).json({ error: 'Name, email, password, and account_type are required' });
    }

    // Validate required fields based on account type
    if (account_type === 'STUDENT') {
      if (!studentID || !program || !semester || !year_of_study) {
        return res.status(400).json({ error: 'StudentID, program, semester, and year_of_study are required for students' });
      }
    } else if (account_type === 'STAFF') {
      if (!staffID || !department || !position) {
        return res.status(400).json({ error: 'StaffID, department, and position are required for staff' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Get connection for transaction
    connection = await oracledb.getConnection();

    // 1. Insert into ACCOUNT table (trigger will auto-create empty STUDENT/STAFF record)
    const accountSql = `
      INSERT INTO ACCOUNT (NAME, EMAIL, PASSWORD_HASH, CONTACT_NUMBER, AVATAR_URL, ACCOUNT_TYPE)
      VALUES (:name, :email, :password, :contact_number, :avatar_url, :type)
      RETURNING ACCOUNT_ID INTO :id
    `;

    const accountBinds = {
      name,
      email,
      password: hashedPassword,
      contact: contact_number || null,
      avatar_url: null,
      type: account_type,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const accountResult = await connection.execute(accountSql, accountBinds);
    const accountId = accountResult.outBinds.id[0];

    // 2. Update the child table with user-provided data
    if (account_type === 'STUDENT') {
      const studentSql = `
        UPDATE STUDENT 
        SET STUDENT_ID = :studentID, 
            PROGRAM = :program, 
            SEMESTER = :semester, 
            YEAR_OF_STUDY = :year_of_study
        WHERE ACCOUNT_ID = :accountId
      `;
      await connection.execute(studentSql, { 
        studentID, 
        program, 
        semester, 
        year_of_study, 
        accountId 
      });

    } else if (account_type === 'STAFF') {
      const staffSql = `
        UPDATE STAFF 
        SET STAFF_ID = :staffID, 
            ROLE = :role, 
            DEPARTMENT = :department, 
            POSITION = :position, 
            SUPERVISOR_ID = :supervisorID
        WHERE ACCOUNT_ID = :accountId
      `;
      await connection.execute(staffSql, { 
        staffID, 
        role: role || 'STAFF', 
        department, 
        position, 
        supervisorID: supervisorID || null,
        accountId 
      });
    }

    await connection.commit();
    await connection.close();

    res.status(201).json({ 
      message: 'Account created successfully',
      account_id: accountId
    });

  } catch (err) {
    if (connection) {
      await connection.rollback();
      await connection.close();
    }
    console.error('Create account error:', err);
    res.status(500).json({ error: 'Failed to create account', details: err.message });
  }
});

// GET /api/accounts/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await exec(
      `SELECT a.ACCOUNT_ID,
              a.NAME,
              a.EMAIL,
              a.CONTACT_NUMBER,
              a.AVATAR_URL,
              a.ACCOUNT_TYPE,
              s.STUDENT_ID,
              s.PROGRAM,
              s.SEMESTER,
              s.YEAR_OF_STUDY,
              f.SUPERVISOR_ID,
              f.STAFF_ID,
              f.ROLE,
              f.DEPARTMENT,
              f.POSITION,
              a.CREATED_AT,
              a.UPDATED_AT
       FROM ACCOUNT a
       LEFT JOIN STUDENT s ON s.ACCOUNT_ID = a.ACCOUNT_ID
       LEFT JOIN STAFF f ON f.ACCOUNT_ID = a.ACCOUNT_ID
       WHERE a.ACCOUNT_ID = :id`,
      { id: req.params.id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const row = result.rows[0];
    const account = {
      ACCOUNT_ID: row.ACCOUNT_ID,
      NAME: row.NAME,
      EMAIL: row.EMAIL,
      CONTACT_NUMBER: row.CONTACT_NUMBER,
      AVATAR_URL: row.AVATAR_URL,
      ACCOUNT_TYPE: row.ACCOUNT_TYPE,
      CREATED_AT: row.CREATED_AT,
      UPDATED_AT: row.UPDATED_AT
    };
    if (row.ACCOUNT_TYPE === 'STUDENT' && row.STUDENT_ID) {
      account.STUDENT_ID = row.STUDENT_ID;
      account.PROGRAM = row.PROGRAM;
      account.SEMESTER = row.SEMESTER;
      account.YEAR_OF_STUDY = row.YEAR_OF_STUDY;
    } else if (row.ACCOUNT_TYPE === 'STAFF' && row.STAFF_ID) {
      account.STAFF_ID = row.STAFF_ID;
      account.ROLE = row.ROLE;
      account.DEPARTMENT = row.DEPARTMENT;
      account.POSITION = row.POSITION;
      account.SUPERVISOR_ID = row.SUPERVISOR_ID;
    }
    res.json(account);
  } catch (err) {
    console.error('Get account error:', err);
    res.status(500).json({ error: 'Failed to get account', details: err.message });
  }
});

// PUT /api/accounts/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, contact_number, password, avatar_url } = req.body;
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
    if (avatar_url) {
      updates.push('AVATAR_URL = :avatar_url');
      binds.avatar_url = avatar_url;
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
