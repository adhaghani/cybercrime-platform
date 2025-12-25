const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { toPlainRows } = require('../helper/toPlainRows');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, contact_number, account_type, studentID, program, semester, year_of_study, 
      role, department, position, staffID, supervisorID
     } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if email already exists
    const existing = await exec(
      `SELECT ACCOUNT_ID FROM ACCOUNT WHERE EMAIL = :email`,
      { email }
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
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
      id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
    // If account created successfully, update the auto-created student record
    if(account_type === 'STUDENT'){
      const studentSql = `
        UPDATE STUDENT SET 
          STUDENT_ID = :studentId, 
          PROGRAM = :program, 
          SEMESTER = :semester, 
          YEAR_OF_STUDY = :yearOfStudy 
        WHERE ACCOUNT_ID = :accountId AND STUDENT_ID IS NULL
      `;
      const studentBinds = {
        studentId: studentID,
        accountId: result.outBinds.id[0],
        program: program || null,
        semester: semester || null,
        yearOfStudy: year_of_study || null
      };
      await exec(studentSql, studentBinds, { autoCommit: true });
    } else {
      const staffSql = `
        UPDATE STAFF SET 
          STAFF_ID = :staffId, 
          ROLE = :role, 
          DEPARTMENT = :department, 
          POSITION = :position,
          SUPERVISOR_ID = :supervisorId
        WHERE ACCOUNT_ID = :accountId AND STAFF_ID IS NULL
      `;
      const staffBinds = {
        staffId: staffID,
        supervisorId: supervisorID || null,
        accountId: result.outBinds.id[0],
        role: role || null,
        department: department || null,
        position: position || null,
      };
      await exec(staffSql, staffBinds, { autoCommit: true });
    }

    res.status(201).json({ 
      message: 'Account created successfully',
      account_id: result.outBinds.id[0]
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
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

    const [account] = toPlainRows(result.rows);
    
    // Verify password
    const validPassword = await bcrypt.compare(password, account.PASSWORD_HASH);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get additional user info based on account type
    let userDetails = {};
    if (account.ACCOUNT_TYPE === 'STUDENT') {
      const studentData = await exec(
        `SELECT STUDENT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY FROM STUDENT WHERE ACCOUNT_ID = :id`,
        { id: account.ACCOUNT_ID }
      );
      if (studentData.rows.length > 0) {
        const [student] = toPlainRows(studentData.rows);
        userDetails = student;
      }
    } else if (account.ACCOUNT_TYPE === 'STAFF') {
      const staffData = await exec(
        `SELECT STAFF_ID, ROLE, DEPARTMENT, POSITION FROM STAFF WHERE ACCOUNT_ID = :id`,
        { id: account.ACCOUNT_ID }
      );
      if (staffData.rows.length > 0) {
        const [staff] = toPlainRows(staffData.rows);
        userDetails = staff;
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        ACCOUNT_ID: account.ACCOUNT_ID,
        EMAIL: account.EMAIL,
        ACCOUNT_TYPE: account.ACCOUNT_TYPE,
        ROLE: userDetails.ROLE || account.ACCOUNT_TYPE
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        ACCOUNT_ID: account.ACCOUNT_ID,
        NAME: account.NAME,
        EMAIL: account.EMAIL,
        CONTACT_NUMBER: account.CONTACT_NUMBER,
        ACCOUNT_TYPE: account.ACCOUNT_TYPE,
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

    const [account] = toPlainRows(result.rows);
    let userDetails = {};

    if (account.ACCOUNT_TYPE === 'STUDENT') {
      const studentData = await exec(
        `SELECT STUDENT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY FROM STUDENT WHERE ACCOUNT_ID = :id`,
        { id: account.ACCOUNT_ID }
      );
      if (studentData.rows.length > 0) {
        const [student] = toPlainRows(studentData.rows);
        userDetails = student;
      }
    } else if (account.ACCOUNT_TYPE === 'STAFF') {
      const staffData = await exec(
        `SELECT STAFF_ID, ROLE, DEPARTMENT, POSITION FROM STAFF WHERE ACCOUNT_ID = :id`,
        { id: account.ACCOUNT_ID }
      );
      if (staffData.rows.length > 0) {
        const [staff] = toPlainRows(staffData.rows);
        userDetails = staff;
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
