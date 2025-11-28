const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
    user: 'PDBADMIN',
    password: 'PDBADMIN',  // ⚠️ CHANGE THIS!
    connectString: 'localhost:1521/FREEPDB1'
};

// ============================================
// TEST ENDPOINT
// ============================================
app.get('/api/test', (req, res) => {
    res.json({ message: '🚀 Cybercrime API is working!' });
});

// ============================================
// ACCOUNT ENDPOINTS
// ============================================

// Get all accounts
app.get('/api/accounts', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT ACCOUNT_ID, NAME, EMAIL, CONTACT_NUMBER, ACCOUNT_TYPE, CREATED_AT FROM ACCOUNT',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// Get account by ID
app.get('/api/accounts/:id', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT ACCOUNT_ID, NAME, EMAIL, CONTACT_NUMBER, ACCOUNT_TYPE, CREATED_AT FROM ACCOUNT WHERE ACCOUNT_ID = :id',
            [req.params.id],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Account not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// ============================================
// REPORT ENDPOINTS
// ============================================

// Get all reports
app.get('/api/reports', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT REPORT_ID, SUBMITTED_BY, TITLE, REPORT_TYPE, LOCATION, STATUS, REPORT_DATE, CREATED_AT FROM REPORT ORDER BY CREATED_AT DESC',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// Get report by ID (with full description)
app.get('/api/reports/:id', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT * FROM REPORT WHERE REPORT_ID = :id',
            [req.params.id],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Report not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// Get reports by status
app.get('/api/reports/status/:status', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT REPORT_ID, SUBMITTED_BY, TITLE, REPORT_TYPE, LOCATION, STATUS, REPORT_DATE FROM REPORT WHERE STATUS = :status ORDER BY CREATED_AT DESC',
            [req.params.status.toUpperCase()],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// Create new report
app.post('/api/reports', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `INSERT INTO REPORT (REPORT_ID, SUBMITTED_BY, UPDATED_BY, TITLE, REPORT_TYPE, DESCRIPTION, LOCATION, STATUS, REPORT_DATE, CREATED_AT) 
             VALUES (REPORT_SEQ.NEXTVAL, :submitted_by, :updated_by, :title, :report_type, :description, :location, :status, SYSDATE, SYSTIMESTAMP)
             RETURNING REPORT_ID INTO :id`,
            {
                submitted_by: req.body.submitted_by,
                updated_by: req.body.updated_by,
                title: req.body.title,
                report_type: req.body.report_type,
                description: req.body.description,
                location: req.body.location,
                status: req.body.status || 'PENDING',
                id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );
        
        res.status(201).json({ 
            message: 'Report created successfully', 
            report_id: result.outBinds.id[0] 
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// ============================================
// CRIME ENDPOINTS
// ============================================

// Get all crimes
app.get('/api/crimes', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT * FROM CRIME ORDER BY CREATED_AT DESC',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// Get crime by report ID
app.get('/api/crimes/report/:reportId', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT * FROM CRIME WHERE REPORT_ID = :reportId',
            [req.params.reportId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// ============================================
// ANNOUNCEMENT ENDPOINTS
// ============================================

// Get all announcements
app.get('/api/announcements', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT * FROM ANNOUNCEMENT ORDER BY CREATED_AT DESC',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// ============================================
// EMERGENCY INFO ENDPOINTS
// ============================================

// Get all emergency contacts
app.get('/api/emergency', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT * FROM EMERGENCY_INFO ORDER BY AGENCY_NAME',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// ============================================
// STAFF ENDPOINTS
// ============================================

// Get all staff
app.get('/api/staff', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT S.STAFF_ID, A.NAME, A.EMAIL, S.ROLE_LEVEL, S.DEPARTMENT 
             FROM STAFF S 
             JOIN ACCOUNT A ON S.STAFF_ID = A.ACCOUNT_ID`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// ============================================
// USERS (STUDENTS) ENDPOINTS
// ============================================

// Get all users/students
app.get('/api/users', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT U.USER_ID, A.NAME, A.EMAIL, U.STUDENT_ID, U.PROGRAM, U.SEMESTER, U.YEAR_OF_STUDY 
             FROM USERS U 
             JOIN ACCOUNT A ON U.USER_ID = A.ACCOUNT_ID`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// ============================================
// DASHBOARD STATISTICS
// ============================================

// Get dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        
        // Total reports
        const totalReports = await connection.execute(
            'SELECT COUNT(*) as TOTAL FROM REPORT',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        // Pending reports
        const pendingReports = await connection.execute(
            "SELECT COUNT(*) as TOTAL FROM REPORT WHERE STATUS = 'PENDING'",
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        // Total crimes
        const totalCrimes = await connection.execute(
            'SELECT COUNT(*) as TOTAL FROM CRIME',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        // Total users
        const totalUsers = await connection.execute(
            'SELECT COUNT(*) as TOTAL FROM USERS',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        res.json({
            total_reports: totalReports.rows[0].TOTAL,
            pending_reports: pendingReports.rows[0].TOTAL,
            total_crimes: totalCrimes.rows[0].TOTAL,
            total_users: totalUsers.rows[0].TOTAL
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`🚀 Cybercrime API Server Running`);
    console.log(`========================================`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📍 Network: http://192.168.0.8:${PORT}`);
    console.log(`========================================`);
    console.log(`Available Endpoints:`);
    console.log(`  GET  /api/accounts`);
    console.log(`  GET  /api/reports`);
    console.log(`  GET  /api/reports/status/:status`);
    console.log(`  POST /api/reports`);
    console.log(`  GET  /api/crimes`);
    console.log(`  GET  /api/announcements`);
    console.log(`  GET  /api/emergency`);
    console.log(`  GET  /api/staff`);
    console.log(`  GET  /api/users`);
    console.log(`  GET  /api/dashboard/stats`);
    console.log(`========================================`);
});