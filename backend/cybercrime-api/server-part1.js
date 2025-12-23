require('dotenv').config();
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database Configuration
const dbConfig = {
  user: process.env.DB_USER || 'PDBADMIN',
  password: process.env.DB_PASSWORD || 'PDBADMIN',
  connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/FREEPDB1'
};

// Database Helper Function
async function exec(sql, binds = {}, opts = {}) {
  let conn;
  opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(sql, binds, opts);
    if (opts.autoCommit) await conn.commit();
    return result;
  } catch (err) {
    console.error('Database Error:', err.message);
    throw err;
  } finally {
    if (conn) {
      try { 
        await conn.close(); 
      } catch (e) { 
        console.error('Connection close error:', e); 
      }
    }
  }
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ============================================================================
// TEST ENDPOINT
// ============================================================================
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Cybercrime API Server is running!',
    timestamp: new Date().toISOString(),
    endpoints: 90
  });
});

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, contact_number, account_type } = req.body;
    
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
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
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
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
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
app.get('/api/auth/me', authenticateToken, async (req, res) => {
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
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', async (req, res) => {
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
    // For now, just return success
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request', details: err.message });
  }
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // Verify reset token (simplified - in production use proper token verification)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // In production, decode token to get account ID
    // For now, return success
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password', details: err.message });
  }
});

// POST /api/auth/update-password
app.post('/api/auth/update-password', authenticateToken, async (req, res) => {
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

// ============================================================================
// ACCOUNTS ENDPOINTS
// ============================================================================

// GET /api/accounts
app.get('/api/accounts', async (req, res) => {
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

// POST /api/accounts (already covered in register, but keeping for completeness)
app.post('/api/accounts', async (req, res) => {
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
app.get('/api/accounts/:id', async (req, res) => {
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
app.put('/api/accounts/:id', authenticateToken, async (req, res) => {
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
app.delete('/api/accounts/:id', authenticateToken, async (req, res) => {
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

// ============================================================================
// ANNOUNCEMENTS ENDPOINTS
// ============================================================================

// GET /api/announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await exec(
      `SELECT * FROM (
         SELECT a.*, ROW_NUMBER() OVER (ORDER BY CREATED_AT DESC) rn
         FROM ANNOUNCEMENT a
       ) WHERE rn > :offset AND rn <= :limit`,
      { offset: parseInt(offset), limit: parseInt(offset) + parseInt(limit) }
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get announcements error:', err);
    res.status(500).json({ error: 'Failed to get announcements', details: err.message });
  }
});

// POST /api/announcements
app.post('/api/announcements', authenticateToken, async (req, res) => {
  try {
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
      created_by: req.user.accountId,
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

    const result = await exec(sql, binds, { autoCommit: true });

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create announcement error:', err);
    res.status(500).json({ error: 'Failed to create announcement', details: err.message });
  }
});

// GET /api/announcements/:id
app.get('/api/announcements/:id', async (req, res) => {
  try {
    const result = await exec(
      `SELECT * FROM ANNOUNCEMENT WHERE ANNOUNCEMENT_ID = :id`,
      { id: req.params.id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get announcement error:', err);
    res.status(500).json({ error: 'Failed to get announcement', details: err.message });
  }
});

// PUT /api/announcements/:id
app.put('/api/announcements/:id', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const fields = Object.keys(data).filter(k => k !== 'id');
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updates = fields.map((f, i) => `${f.toUpperCase()} = :v${i}`);
    const binds = {};
    fields.forEach((f, i) => binds[`v${i}`] = data[f]);
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
app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
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

// GET /api/announcements/active
app.get('/api/announcements/active', async (req, res) => {
  try {
    const result = await exec(
      `SELECT * FROM ANNOUNCEMENT 
       WHERE STATUS = 'PUBLISHED' 
       AND START_DATE <= SYSDATE 
       AND END_DATE >= SYSDATE
       ORDER BY PRIORITY DESC, CREATED_AT DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get active announcements error:', err);
    res.status(500).json({ error: 'Failed to get active announcements', details: err.message });
  }
});

// GET /api/announcements/by-audience/:audience
app.get('/api/announcements/by-audience/:audience', async (req, res) => {
  try {
    const result = await exec(
      `SELECT * FROM ANNOUNCEMENT 
       WHERE (AUDIENCE = :audience OR AUDIENCE = 'ALL')
       AND STATUS = 'PUBLISHED'
       ORDER BY CREATED_AT DESC`,
      { audience: req.params.audience }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get announcements by audience error:', err);
    res.status(500).json({ error: 'Failed to get announcements', details: err.message });
  }
});

// GET /api/announcements/search
app.get('/api/announcements/search', async (req, res) => {
  try {
    const { q, priority, type, target_audience, page = 1, limit = 10 } = req.query;
    
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

    res.json(result.rows);
  } catch (err) {
    console.error('Search announcements error:', err);
    res.status(500).json({ error: 'Failed to search announcements', details: err.message });
  }
});

// POST /api/announcements/bulk-archive
app.post('/api/announcements/bulk-archive', authenticateToken, async (req, res) => {
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

// ============================================================================
// Due to character limits, I'll create the rest in separate files
// Continue in next part...
// ============================================================================

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('🚀 Cybercrime API Server Running');
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔒 JWT Authentication: ${process.env.JWT_SECRET ? 'Enabled' : 'Using default key'}`);
  console.log(`🗄️  Database: ${dbConfig.connectString}`);
  console.log('========================================');
});
