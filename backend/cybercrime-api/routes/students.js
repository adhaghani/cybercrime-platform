const express = require('express');
const oracledb = require('oracledb');
const { exec } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/students
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { program, semester, year_of_study, page = 1, limit = 100 } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (program) {
      whereClauses.push('st.PROGRAM = :program');
      binds.program = program;
    }
    if (semester) {
      whereClauses.push('st.SEMESTER = :semester');
      binds.semester = semester;
    }
    if (year_of_study) {
      whereClauses.push('st.YEAR_OF_STUDY = :year');
      binds.year = year_of_study;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT st.ACCOUNT_ID, st.STUDENT_ID, st.PROGRAM, st.SEMESTER, 
             st.YEAR_OF_STUDY, st.CREATED_AT, st.UPDATED_AT, a.AVATAR_URL,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER
      FROM STUDENT st
      JOIN ACCOUNT a ON st.ACCOUNT_ID = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY st.CREATED_AT DESC
    `;
    
    const result = await exec(sql, binds);
    res.json({ students: result.rows });
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ error: 'Failed to get students', details: err.message });
  }
});

// POST /api/students
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { account_id, student_id, program, semester, year_of_study } = req.body;
    
    if (!account_id || !program || !semester || !year_of_study) {
      return res.status(400).json({ error: 'Account ID, program, semester, and year of study are required' });
    }

    const sql = `
      INSERT INTO STUDENT (
        STUDENT_ID, ACCOUNT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY, 
        CREATED_AT, UPDATED_AT
      ) VALUES (
        student_seq.NEXTVAL, :account_id, :program, :semester, :year_of_study,
        SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING STUDENT_ID INTO :id
    `;
    
    const binds = {
      account_id,
      program,
      semester,
      year_of_study,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await exec(sql, binds, { autoCommit: true });
    
    res.status(201).json({
      message: 'Student record created successfully',
      student_id: result.outBinds.id[0]
    });
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ error: 'Failed to create student record', details: err.message });
  }
});

// GET /api/students/search
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, program, semester, year, page = 1, limit = 20 } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (q) {
      whereClauses.push('(UPPER(a.NAME) LIKE :search OR UPPER(a.EMAIL) LIKE :search OR UPPER(st.STUDENT_ID) LIKE :search)');
      binds.search = `%${q.toUpperCase()}%`;
    }
    if (program) {
      whereClauses.push('st.PROGRAM = :program');
      binds.program = program;
    }
    if (semester) {
      whereClauses.push('st.SEMESTER = :semester');
      binds.semester = semester;
    }
    if (year) {
      whereClauses.push('st.YEAR_OF_STUDY = :year');
      binds.year = year;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT st.ACCOUNT_ID, st.STUDENT_ID, st.PROGRAM, st.SEMESTER, st.YEAR_OF_STUDY, a.AVATAR_URL,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER
      FROM STUDENT st
      JOIN ACCOUNT a ON st.ACCOUNT_ID = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY a.NAME
    `;
    
    const result = await exec(sql, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Search students error:', err);
    res.status(500).json({ error: 'Failed to search students', details: err.message });
  }
});

// GET /api/students/export
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const { format = 'csv', program, semester, year } = req.query;
    
    let whereClauses = [];
    const binds = {};

    if (program) {
      whereClauses.push('st.PROGRAM = :program');
      binds.program = program;
    }
    if (semester) {
      whereClauses.push('st.SEMESTER = :semester');
      binds.semester = semester;
    }
    if (year) {
      whereClauses.push('st.YEAR_OF_STUDY = :year');
      binds.year = year;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const sql = `
      SELECT st.STUDENT_ID, a.NAME, a.EMAIL, a.CONTACT_NUMBER, 
             st.PROGRAM, st.SEMESTER, st.YEAR_OF_STUDY, st.CREATED_AT
      FROM STUDENT st
      JOIN ACCOUNT a ON st.ACCOUNT_ID = a.ACCOUNT_ID
      ${whereClause}
      ORDER BY a.NAME
    `;
    
    const result = await exec(sql, binds);
    
    if (format === 'csv') {
      const csv = [
        ['Student ID', 'Name', 'Email', 'Contact', 'Program', 'Semester', 'Year', 'Created At'],
        ...result.rows.map(row => [
          row.STUDENT_ID,
          row.NAME,
          row.EMAIL,
          row.CONTACT_NUMBER || '',
          row.PROGRAM,
          row.SEMESTER,
          row.YEAR_OF_STUDY,
          row.CREATED_AT
        ])
      ].map(row => row.join(',')).join('\n');
      
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename=students_export.csv');
      res.send(csv);
    } else {
      res.json(result.rows);
    }
  } catch (err) {
    console.error('Export students error:', err);
    res.status(500).json({ error: 'Failed to export students', details: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT st.ACCOUNT_ID, st.STUDENT_ID, st.PROGRAM, st.SEMESTER, 
             st.YEAR_OF_STUDY, st.CREATED_AT, st.UPDATED_AT,
             a.NAME, a.EMAIL, a.CONTACT_NUMBER, a.AVATAR_URL
      FROM STUDENT st
      JOIN ACCOUNT a ON st.ACCOUNT_ID = a.ACCOUNT_ID
      WHERE st.ACCOUNT_ID = :id
    `;
    
    const result = await exec(sql, { id: req.params.id });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ error: 'Failed to get student', details: err.message });
  }
});

// PUT /api/students/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { program, semester, year_of_study } = req.body;
    
    const updates = [];
    const binds = { id: req.params.id };
    
    if (program) {
      updates.push('PROGRAM = :program');
      binds.program = program;
    }
    if (semester) {
      updates.push('SEMESTER = :semester');
      binds.semester = semester;
    }
    if (year_of_study) {
      updates.push('YEAR_OF_STUDY = :year_of_study');
      binds.year_of_study = year_of_study;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push('UPDATED_AT = SYSTIMESTAMP');
    
    const sql = `UPDATE STUDENT SET ${updates.join(', ')} WHERE ACCOUNT_ID = :id`;
    
    await exec(sql, binds, { autoCommit: true });
    
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Failed to update student', details: err.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `DELETE FROM STUDENT WHERE ACCOUNT_ID = :id`;
    
    await exec(sql, { id: req.params.id }, { autoCommit: true });
    
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ error: 'Failed to delete student', details: err.message });
  }
});

module.exports = router;
