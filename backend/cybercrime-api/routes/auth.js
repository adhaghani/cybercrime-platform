const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const oracledb = require('oracledb');
  const { dbConfig } = require('../database/connection');
  let connection;
  
  try {
    const { 
      name, email, password, contact_number, account_type,
      studentID, program, semester, year_of_study
    } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // For students, validate required fields
    if (account_type === 'STUDENT' && (!studentID || !program || !semester || !year_of_study)) {
      return res.status(400).json({ 
        error: 'Student ID, program, semester, and year of study are required for student accounts' 
      });
    }

    // Get connection FIRST for the entire transaction
    connection = await oracledb.getConnection(dbConfig);

    // Check if email already exists (using same connection)
    const existing = await connection.execute(
      `SELECT ACCOUNT_ID FROM ACCOUNT WHERE EMAIL = :email`,
      { email }
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into ACCOUNT table
    const accountSql = `
      INSERT INTO ACCOUNT (
        ACCOUNT_ID, NAME, EMAIL, PASSWORD_HASH, CONTACT_NUMBER, 
        ACCOUNT_TYPE, CREATED_AT, UPDATED_AT
      ) VALUES (
        account_seq.NEXTVAL, :name, :email, :password_hash, :contact_number, 
        :account_type, SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING ACCOUNT_ID INTO :account_id
    `;
    
    const accountBinds = {
      name,
      email,
      password_hash: hashedPassword,
      contact_number: contact_number || null,
      account_type: account_type || 'STUDENT',
      account_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const accountResult = await connection.execute(accountSql, accountBinds);
    const accountId = accountResult.outBinds.account_id[0];

    console.log('Created account with ID:', accountId);

    // If student, insert into STUDENT table
    if (account_type === 'STUDENT') {
      const studentSql = `
        INSERT INTO STUDENT (
          ACCOUNT_ID, STUDENT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY,
          CREATED_AT, UPDATED_AT
        ) VALUES (
          :account_id, :student_id, :program, :semester, :year_of_study,
          SYSTIMESTAMP, SYSTIMESTAMP
        )
      `;
      
      const studentBinds = {
        account_id: accountId,
        student_id: parseInt(studentID, 10),
        program,
        semester: parseInt(semester, 10),
        year_of_study: parseInt(year_of_study, 10)
      };

      console.log('Inserting student with data:', studentBinds);
      await connection.execute(studentSql, studentBinds);
    }

    // Commit transaction - BOTH inserts succeed or BOTH fail
    await connection.commit();
    console.log('Transaction committed successfully');
    
    res.status(201).json({ 
      message: 'Account created successfully',
      account_id: accountId
    });
  } catch (err) {
    console.error('Registration error:', err);
    // Rollback on error
    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back');
      } catch (rollbackErr) {
        console.error('Rollback error:', rollbackErr);
      }
    }
    res.status(500).json({ error: 'Registration failed', details: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'data received tho but Email and password are required' });
    }

    // Get account with password
    const result = await exec(
      `SELECT ACCOUNT_ID, NAME, EMAIL, PASSWORD_HASH, ACCOUNT_TYPE, CONTACT_NUMBER 
      FROM ACCOUNT WHERE EMAIL = :email`,
      { email }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const account = result.rows[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, account.PASSWORD_HASH);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get additional user info based on account type
    let userDetails = {};
    if (account.ACCOUNT_TYPE === 'STUDENT') {
      const studentData = await exec(
        `SELECT STUDENT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY 
        FROM STUDENT WHERE ACCOUNT_ID = :id`,
        { id: account.ACCOUNT_ID }
      );
      if (studentData.rows.length > 0) {
        userDetails = {
          studentId: studentData.rows[0].STUDENT_ID,
          program: studentData.rows[0].PROGRAM,
          semester: studentData.rows[0].SEMESTER,
          yearOfStudy: studentData.rows[0].YEAR_OF_STUDY
        };
      }
    } else if (account.ACCOUNT_TYPE === 'STAFF') {
      const staffData = await exec(
        `SELECT ROLE, DEPARTMENT, POSITION FROM STAFF WHERE ACCOUNT_ID = :id`,
        { id: account.ACCOUNT_ID }
      );
      if (staffData.rows.length > 0) {
        userDetails = staffData.rows[0];
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        accountId: account.ACCOUNT_ID,
        email: account.EMAIL,
        accountType: account.ACCOUNT_TYPE,
        role: userDetails.ROLE || account.ACCOUNT_TYPE
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        accountId: account.ACCOUNT_ID,
        name: account.NAME,
        email: account.EMAIL,
        contactNumber: account.CONTACT_NUMBER,
        accountType: account.ACCOUNT_TYPE,
        ...userDetails
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await exec(
      `SELECT ACCOUNT_ID, NAME, EMAIL, CONTACT_NUMBER, ACCOUNT_TYPE, CREATED_AT 
       FROM ACCOUNT WHERE ACCOUNT_ID = :id`,
      { id: req.user.accountId }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const account = result.rows[0];
    let userDetails = {};

    if (account.ACCOUNT_TYPE === 'STUDENT') {
      const studentData = await exec(
        `SELECT PROGRAM, SEMESTER, YEAR_OF_STUDY FROM STUDENT WHERE ACCOUNT_ID = :id`,
        { id: account.ACCOUNT_ID }
      );
      if (studentData.rows.length > 0) {
        userDetails = studentData.rows[0];
      }
    } else if (account.ACCOUNT_TYPE === 'STAFF') {
      const staffData = await exec(
        `SELECT ROLE, DEPARTMENT, POSITION FROM STAFF WHERE ACCOUNT_ID = :id`,
        { id: account.ACCOUNT_ID }
      );
      if (staffData.rows.length > 0) {
        userDetails = staffData.rows[0];
      }
    }

    res.json({
      ...account,
      ...userDetails
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user', details: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email exists
    const result = await exec(
      `SELECT ACCOUNT_ID FROM ACCOUNT WHERE EMAIL = :email`,
      { email }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // In production, send reset email here
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request', details: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // In production, verify reset token and update password
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password', details: err.message });
  }
});

// POST /api/auth/update-password
router.post('/update-password', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await exec(
      `UPDATE ACCOUNT SET PASSWORD_HASH = :password, UPDATED_AT = SYSTIMESTAMP 
       WHERE ACCOUNT_ID = :id`,
      { password: hashedPassword, id: req.user.accountId },
      { autoCommit: true }
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: 'Failed to update password', details: err.message });
  }
});

module.exports = router;
