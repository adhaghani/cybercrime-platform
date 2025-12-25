const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/report-assignments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT ra.ASSIGNMENT_ID, ra.ACCOUNT_ID, ra.REPORT_ID, ra.ASSIGNED_AT, 
             ra.ACTION_TAKEN, ra.ADDITIONAL_FEEDBACK, ra.UPDATED_AT,
             r.TITLE as REPORT_TITLE, r.TYPE as REPORT_TYPE, r.STATUS as REPORT_STATUS, 
             r.LOCATION as REPORT_LOCATION, r.SUBMITTED_AT as REPORT_SUBMITTED_AT,
             a.NAME as STAFF_NAME, a.EMAIL as STAFF_EMAIL
      FROM REPORT_ASSIGNMENT ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON ra.ACCOUNT_ID = a.ACCOUNT_ID
      ORDER BY ra.ASSIGNED_AT DESC
    `;
    
    const result = await exec(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Get report assignments error:', err);
    res.status(500).json({ error: 'Failed to get report assignments', details: err.message });
  }
});

// POST /api/report-assignments
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { account_id, report_id, action_taken, additional_feedback } = req.body;
    
    if (!account_id || !report_id) {
      return res.status(400).json({ error: 'Account ID and Report ID are required' });
    }

    const sql = `
      INSERT INTO REPORT_ASSIGNMENT (
        ASSIGNMENT_ID, ACCOUNT_ID, REPORT_ID, ASSIGNED_AT, 
        ACTION_TAKEN, ADDITIONAL_FEEDBACK, UPDATED_AT
      ) VALUES (
        assignment_seq.NEXTVAL, :account_id, :report_id, SYSTIMESTAMP, 
        :action_taken, :additional_feedback, SYSTIMESTAMP
      ) RETURNING ASSIGNMENT_ID INTO :id
    `;
    
    const binds = {
      account_id,
      report_id,
      action_taken: action_taken || null,
      additional_feedback: additional_feedback || null,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
    res.status(201).json({
      message: 'Report assignment created successfully',
      assignment_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create report assignment error:', err);
    res.status(500).json({ error: 'Failed to create report assignment', details: err.message });
  }
});

// GET /api/report-assignments/my-assignments
router.get('/my-assignments', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT ra.ASSIGNMENT_ID, ra.ACCOUNT_ID, ra.REPORT_ID, ra.ASSIGNED_AT, 
             ra.ACTION_TAKEN, ra.ADDITIONAL_FEEDBACK, ra.UPDATED_AT,
             r.TITLE as REPORT_TITLE, r.TYPE as REPORT_TYPE, r.STATUS as REPORT_STATUS, 
             r.LOCATION as REPORT_LOCATION, r.SUBMITTED_AT as REPORT_SUBMITTED_AT,
             r.DESCRIPTION as REPORT_DESCRIPTION
      FROM REPORT_ASSIGNMENT ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      WHERE ra.ACCOUNT_ID = :account_id
      ORDER BY ra.ASSIGNED_AT DESC
    `;
    
    const result = await exec(sql, { account_id: req.user.accountId });
    res.json(result.rows);
  } catch (err) {
    console.error('Get my assignments error:', err);
    res.status(500).json({ error: 'Failed to get my assignments', details: err.message });
  }
});

// GET /api/report-assignments/by-report/:reportId
router.get('/by-report/:reportId', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT ra.ASSIGNMENT_ID, ra.ACCOUNT_ID, ra.REPORT_ID, ra.ASSIGNED_AT, 
             ra.ACTION_TAKEN, ra.ADDITIONAL_FEEDBACK, ra.UPDATED_AT,
             a.NAME as STAFF_NAME, a.EMAIL as STAFF_EMAIL
      FROM REPORT_ASSIGNMENT ra
      JOIN ACCOUNT a ON ra.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE ra.REPORT_ID = :report_id
      ORDER BY ra.ASSIGNED_AT DESC
    `;
    
    const result = await exec(sql, { report_id: req.params.reportId });
    res.json(result.rows);
  } catch (err) {
    console.error('Get assignments by report error:', err);
    res.status(500).json({ error: 'Failed to get assignments', details: err.message });
  }
});

// GET /api/report-assignments/by-staff/:staffId
router.get('/by-staff/:staffId', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT ra.ASSIGNMENT_ID, ra.ACCOUNT_ID, ra.REPORT_ID, ra.ASSIGNED_AT, 
             ra.ACTION_TAKEN, ra.ADDITIONAL_FEEDBACK, ra.UPDATED_AT,
             r.TITLE as REPORT_TITLE, r.TYPE as REPORT_TYPE, r.STATUS as REPORT_STATUS
      FROM REPORT_ASSIGNMENT ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      WHERE ra.ACCOUNT_ID = :account_id
      ORDER BY ra.ASSIGNED_AT DESC
    `;
    
    const result = await exec(sql, { account_id: req.params.staffId });
    res.json(result.rows);
  } catch (err) {
    console.error('Get assignments by staff error:', err);
    res.status(500).json({ error: 'Failed to get assignments', details: err.message });
  }
});

// GET /api/report-assignments/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT ra.ASSIGNMENT_ID, ra.ACCOUNT_ID, ra.REPORT_ID, ra.ASSIGNED_AT, 
             ra.ACTION_TAKEN, ra.ADDITIONAL_FEEDBACK, ra.UPDATED_AT,
             r.TITLE as REPORT_TITLE, r.TYPE as REPORT_TYPE, r.STATUS as REPORT_STATUS,
             a.NAME as STAFF_NAME, a.EMAIL as STAFF_EMAIL
      FROM REPORT_ASSIGNMENT ra
      JOIN REPORT r ON ra.REPORT_ID = r.REPORT_ID
      JOIN ACCOUNT a ON ra.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE ra.ASSIGNMENT_ID = :id
    `;
    
    const result = await exec(sql, { id: req.params.id });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get assignment error:', err);
    res.status(500).json({ error: 'Failed to get assignment', details: err.message });
  }
});

// PUT /api/report-assignments/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { action_taken, additional_feedback } = req.body;
    
    const sql = `
      UPDATE REPORT_ASSIGNMENT 
      SET ACTION_TAKEN = :action_taken,
          ADDITIONAL_FEEDBACK = :additional_feedback,
          UPDATED_AT = SYSTIMESTAMP
      WHERE ASSIGNMENT_ID = :id
    `;
    
    const binds = {
      action_taken,
      additional_feedback,
      id: req.params.id
    };

    await exec(sql, binds, { autoCommit: true });
    
    res.json({ message: 'Assignment updated successfully' });
  } catch (err) {
    console.error('Update assignment error:', err);
    res.status(500).json({ error: 'Failed to update assignment', details: err.message });
  }
});

// PUT /api/report-assignments/bulk-update
router.put('/bulk-update', authenticateToken, async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Updates array is required' });
    }

    let updated = 0;
    for (const update of updates) {
      const sql = `
        UPDATE REPORT_ASSIGNMENT 
        SET ACTION_TAKEN = :action_taken,
            ADDITIONAL_FEEDBACK = :additional_feedback,
            UPDATED_AT = SYSTIMESTAMP
        WHERE ASSIGNMENT_ID = :id
      `;
      
      await exec(sql, {
        action_taken: update.action_taken,
        additional_feedback: update.additional_feedback,
        id: update.id
      }, { autoCommit: true });
      updated++;
    }
    
    res.json({ message: 'Assignments updated successfully', updated });
  } catch (err) {
    console.error('Bulk update assignments error:', err);
    res.status(500).json({ error: 'Failed to update assignments', details: err.message });
  }
});

// DELETE /api/report-assignments/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `DELETE FROM REPORT_ASSIGNMENT WHERE ASSIGNMENT_ID = :id`;
    
    await exec(sql, { id: req.params.id }, { autoCommit: true });
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error('Delete assignment error:', err);
    res.status(500).json({ error: 'Failed to delete assignment', details: err.message });
  }
});

module.exports = router;
