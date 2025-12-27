const express = require('express');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get overall statistics
    const queries = await Promise.all([
      exec('SELECT COUNT(*) as COUNT FROM REPORT'),
      exec('SELECT COUNT(*) as COUNT FROM REPORT WHERE STATUS = :status', { status: 'PENDING' }),
      exec('SELECT COUNT(*) as COUNT FROM REPORT WHERE STATUS = :status', { status: 'RESOLVED' }),
      exec('SELECT COUNT(*) as COUNT FROM REPORT WHERE TYPE = :type', { type: 'CRIME' }),
      exec('SELECT COUNT(*) as COUNT FROM REPORT WHERE TYPE = :type', { type: 'FACILITY' }),
      exec('SELECT COUNT(*) as COUNT FROM STUDENT'),
      exec('SELECT COUNT(*) as COUNT FROM STAFF'),
      exec('SELECT COUNT(*) as COUNT FROM ANNOUNCEMENT'),
      exec('SELECT COUNT(*) as COUNT FROM REPORT_ASSIGNMENT'),
    ]);

    res.json({
      totalReports: queries[0].rows[0].COUNT,
      pendingReports: queries[1].rows[0].COUNT,
      resolvedReports: queries[2].rows[0].COUNT,
      totalCrimes: queries[3].rows[0].COUNT,
      totalFacilities: queries[4].rows[0].COUNT,
      totalStudents: queries[5].rows[0].COUNT,
      totalStaff: queries[6].rows[0].COUNT,
      totalAnnouncements: queries[7].rows[0].COUNT,
      totalAssignments: queries[8].rows[0].COUNT,
    });
  } catch (err) {
    console.error('Get dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to get dashboard statistics', details: err.message });
  }
});

// GET /api/dashboard/user-stats
router.get('/user-stats', authenticateToken, async (req, res) => {
  try {
    const accountId = req.user.accountId;

    const queries = await Promise.all([
      exec('SELECT COUNT(*) as COUNT FROM REPORT WHERE SUBMITTED_BY = :id', { id: accountId }),
      exec('SELECT COUNT(*) as COUNT FROM REPORT WHERE SUBMITTED_BY = :id AND STATUS = :status', 
        { id: accountId, status: 'PENDING' }),
      exec('SELECT COUNT(*) as COUNT FROM REPORT_ASSIGNMENT WHERE ACCOUNT_ID = :id', { id: accountId }),
      exec(`SELECT COUNT(*) as COUNT FROM REPORT_ASSIGNMENT ra 
            JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID 
            WHERE ra.ACCOUNT_ID = :id AND r.STATUS = :status`, 
        { id: accountId, status: 'PENDING' }),
    ]);

    res.json({
      myReports: queries[0].rows[0].COUNT,
      myPendingReports: queries[1].rows[0].COUNT,
      myAssignments: queries[2].rows[0].COUNT,
      pendingActions: queries[3].rows[0].COUNT,
    });
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({ error: 'Failed to get user statistics', details: err.message });
  }
});

// GET /api/dashboard/recent-activity
router.get('/recent-activity', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;

    const sql = `
      SELECT 'REPORT' as ACTIVITY_TYPE, 
             REPORT_ID as ID, 
             TITLE as DESCRIPTION, 
             SUBMITTED_AT as TIMESTAMP,
             STATUS
      FROM REPORT
      WHERE SUBMITTED_AT >= SYSTIMESTAMP - INTERVAL '${days}' DAY
      UNION ALL
      SELECT 'ASSIGNMENT' as ACTIVITY_TYPE,
             ASSIGNMENT_ID as ID,
             'Report assigned' as DESCRIPTION,
             ASSIGNED_AT as TIMESTAMP,
             'ASSIGNED' as STATUS
      FROM REPORT_ASSIGNMENT
      WHERE ASSIGNED_AT >= SYSTIMESTAMP - INTERVAL '${days}' DAY
      UNION ALL
      SELECT 'ANNOUNCEMENT' as ACTIVITY_TYPE,
             ANNOUNCEMENT_ID as ID,
             TITLE as DESCRIPTION,
             CREATED_AT as TIMESTAMP,
             STATUS
      FROM ANNOUNCEMENT
      WHERE CREATED_AT >= SYSTIMESTAMP - INTERVAL '${days}' DAY
      ORDER BY TIMESTAMP DESC
      FETCH FIRST ${limit} ROWS ONLY
    `;

    const result = await exec(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Get recent activity error:', err);
    res.status(500).json({ error: 'Failed to get recent activity', details: err.message });
  }
});

// GET /api/dashboard/charts
router.get('/charts', authenticateToken, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFormat, interval;
    switch (period) {
      case 'week':
        dateFormat = 'IW';
        interval = '7';
        break;
      case 'year':
        dateFormat = 'YYYY';
        interval = '365';
        break;
      default:
        dateFormat = 'YYYY-MM';
        interval = '30';
    }

    // Reports by time
    const reportsTrendSql = `
      SELECT TO_CHAR(SUBMITTED_AT, '${dateFormat}') as PERIOD, 
             COUNT(*) as COUNT
      FROM REPORT
      WHERE SUBMITTED_AT >= SYSTIMESTAMP - INTERVAL '${interval}' DAY
      GROUP BY TO_CHAR(SUBMITTED_AT, '${dateFormat}')
      ORDER BY PERIOD
    `;

    // Reports by status
    const statusSql = `
      SELECT STATUS, COUNT(*) as COUNT
      FROM REPORT
      GROUP BY STATUS
    `;

    // Reports by type
    const typeSql = `
      SELECT TYPE, COUNT(*) as COUNT
      FROM REPORT
      GROUP BY TYPE
    `;

    const [trendResult, statusResult, typeResult] = await Promise.all([
      exec(reportsTrendSql),
      exec(statusSql),
      exec(typeSql)
    ]);

    res.json({
      reportsTrend: trendResult.rows,
      reportsByStatus: statusResult.rows,
      reportsByType: typeResult.rows,
    });
  } catch (err) {
    console.error('Get dashboard charts error:', err);
    res.status(500).json({ error: 'Failed to get chart data', details: err.message });
  }
});

module.exports = router;
