const express = require('express');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { toPlainRows } = require('../helper/toPlainRows');

const router = express.Router();

// GET /api/teams - Get all teams organized by supervisor
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get all supervisors with their team members
    const sql = `
      SELECT 
        s.ACCOUNT_ID as SUPERVISOR_ID,
        a.NAME as SUPERVISOR_NAME,
        a.EMAIL as SUPERVISOR_EMAIL,
        a.CONTACT_NUMBER as SUPERVISOR_CONTACT,
        a.AVATAR_URL as SUPERVISOR_AVATAR_URL,
        s.STAFF_ID as SUPERVISOR_STAFF_ID,
        s.ROLE as SUPERVISOR_ROLE,
        s.DEPARTMENT as SUPERVISOR_DEPARTMENT,
        s.POSITION as SUPERVISOR_POSITION,
        COUNT(team.ACCOUNT_ID) as TEAM_SIZE
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      LEFT JOIN STAFF team ON team.SUPERVISOR_ID = s.ACCOUNT_ID AND team.ACCOUNT_ID != s.ACCOUNT_ID
      WHERE s.ROLE = 'SUPERVISOR'
      GROUP BY s.ACCOUNT_ID, a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL, s.STAFF_ID, s.ROLE, s.DEPARTMENT, s.POSITION
      ORDER BY TEAM_SIZE DESC, a.NAME
    `;
    
    const result = await exec(sql);
    const supervisors = toPlainRows(result.rows);
    
    // For each supervisor, get their team members
    const teams = await Promise.all(supervisors.map(async (supervisor) => {
      const membersSql = `
        SELECT 
          s.ACCOUNT_ID,
          s.STAFF_ID,
          s.ROLE,
          s.DEPARTMENT,
          s.POSITION,
          s.SUPERVISOR_ID,
          a.NAME,
          a.AVATAR_URL,
          a.EMAIL,
          a.CONTACT_NUMBER,
          a.ACCOUNT_TYPE
        FROM STAFF s
        JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
        WHERE s.SUPERVISOR_ID = :supervisorId AND s.ACCOUNT_ID != :supervisorId
        ORDER BY a.NAME
      `;
      
      const membersResult = await exec(membersSql, { supervisorId: supervisor.SUPERVISOR_ID });
      const members = toPlainRows(membersResult.rows);
      
      return {
        supervisor: {
          ACCOUNT_ID: supervisor.SUPERVISOR_ID,
          NAME: supervisor.SUPERVISOR_NAME,
          EMAIL: supervisor.SUPERVISOR_EMAIL,
          CONTACT_NUMBER: supervisor.SUPERVISOR_CONTACT,
          STAFF_ID: supervisor.SUPERVISOR_STAFF_ID,
          ROLE: supervisor.SUPERVISOR_ROLE,
          DEPARTMENT: supervisor.SUPERVISOR_DEPARTMENT,
          POSITION: supervisor.SUPERVISOR_POSITION,
        },
        members,
        teamSize: supervisor.TEAM_SIZE
      };
    }));
    
    res.json({ teams });
  } catch (err) {
    console.error('Get teams error:', err);
    res.status(500).json({ error: 'Failed to get teams', details: err.message });
  }
});

// GET /api/teams/my-team - Get current user's team
router.get('/my-team', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.accountId || req.user.ACCOUNT_ID || req.user.id;
    
    // Get current user's details
    const userSql = `
      SELECT 
        s.ACCOUNT_ID,
        s.STAFF_ID,
        s.ROLE,
        s.DEPARTMENT,
        s.POSITION,
        s.SUPERVISOR_ID,
        a.NAME,
        a.EMAIL,
        a.AVATAR_URL,
        a.CONTACT_NUMBER
      FROM STAFF s
      JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE s.ACCOUNT_ID = :userId
    `;
    
    const userResult = await exec(userSql, { userId: currentUserId });
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const [currentUser] = toPlainRows(userResult.rows);
    
    let supervisor = null;
    let teamMembers = [];
    
    // If user is a supervisor, get their team
    if (currentUser.ROLE === 'SUPERVISOR') {
      const teamSql = `
        SELECT 
          s.ACCOUNT_ID,
          s.STAFF_ID,
          s.ROLE,
          s.DEPARTMENT,
          s.POSITION,
          s.SUPERVISOR_ID,
          a.AVATAR_URL,
          a.NAME,
          a.EMAIL,
          a.CONTACT_NUMBER
        FROM STAFF s
        JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
        WHERE s.SUPERVISOR_ID = :supervisorId AND s.ACCOUNT_ID != :supervisorId
        ORDER BY a.NAME
      `;
      
      const teamResult = await exec(teamSql, { supervisorId: currentUserId });
      teamMembers = toPlainRows(teamResult.rows);
    } else if (currentUser.SUPERVISOR_ID) {
      // If user has a supervisor, get supervisor details and team members
      const supervisorSql = `
        SELECT 
          s.ACCOUNT_ID,
          s.STAFF_ID,
          s.ROLE,
          s.DEPARTMENT,
          s.POSITION,
          a.NAME,
          a.AVATAR_URL,
          a.EMAIL,
          a.CONTACT_NUMBER
        FROM STAFF s
        JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
        WHERE s.ACCOUNT_ID = :supervisorId
      `;
      
      const supervisorResult = await exec(supervisorSql, { supervisorId: currentUser.SUPERVISOR_ID });
      if (supervisorResult.rows.length > 0) {
        [supervisor] = toPlainRows(supervisorResult.rows);
      }
      
      // Get other team members with same supervisor
      const teamSql = `
        SELECT 
          s.ACCOUNT_ID,
          s.STAFF_ID,
          s.ROLE,
          s.DEPARTMENT,
          s.POSITION,
          s.SUPERVISOR_ID,
          a.NAME,
          a.EMAIL,
          a.AVATAR_URL,
          a.CONTACT_NUMBER
        FROM STAFF s
        JOIN ACCOUNT a ON s.ACCOUNT_ID = a.ACCOUNT_ID
        WHERE s.SUPERVISOR_ID = :supervisorId AND s.ACCOUNT_ID != :currentUserId
        ORDER BY a.NAME
      `;
      
      const teamResult = await exec(teamSql, { 
        supervisorId: currentUser.SUPERVISOR_ID,
        currentUserId: currentUserId
      });
      teamMembers = toPlainRows(teamResult.rows);
    }
    
    res.json({
      currentUser,
      supervisor,
      teamMembers,
      teamSize: teamMembers.length
    });
  } catch (err) {
    console.error('Get my team error:', err);
    res.status(500).json({ error: 'Failed to get team', details: err.message });
  }
});

module.exports = router;
