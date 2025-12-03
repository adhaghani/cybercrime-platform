const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// ----------------- DB CONFIG -----------------
const dbConfig = {
  user: 'PDBADMIN',
  password: 'PDBADMIN',
  connectString: 'localhost:1521/FREEPDB1'
};

async function exec(sql, binds = {}, opts = {}) {
  let conn;
  opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(sql, binds, opts);
    if (opts.autoCommit) await conn.commit();
    return result;
  } finally {
    if (conn) try { await conn.close(); } catch (e) { /* ignore */ }
  }
}

// ----------------- TEST -----------------
app.get('/api/test', (req, res) => res.json({ message: 'API OK' }));

// ----------------- ACCOUNT -----------------
app.post('/api/accounts', async (req, res) => {
  try {
    const { name, email, password, contact_number, account_type } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name,email,password required' });

    const hashed = bcrypt.hashSync(password, 10);

    const sql = `
      INSERT INTO ACCOUNT (
        ACCOUNT_ID, NAME, EMAIL, PASSWORD_HASH, CONTACT_NUMBER, ACCOUNT_TYPE, CREATED_AT, UPDATED_AT
      ) VALUES (
        account_seq.NEXTVAL, :name, :email, :pw, :contact, :type, SYSTIMESTAMP, SYSTIMESTAMP
      ) RETURNING ACCOUNT_ID INTO :id
    `;
    const binds = {
      name, email, pw: hashed, contact: contact_number || null, type: account_type || 'student',
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };
    const r = await exec(sql, binds, { autoCommit: true });
    res.status(201).json({ message: 'Account created', account_id: r.outBinds.id[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/accounts', async (req, res) => {
  try {
    const r = await exec(`SELECT ACCOUNT_ID, NAME, EMAIL, CONTACT_NUMBER, ACCOUNT_TYPE, CREATED_AT, UPDATED_AT FROM ACCOUNT ORDER BY ACCOUNT_ID`);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/accounts/:id', async (req, res) => {
  try {
    const r = await exec(`SELECT ACCOUNT_ID, NAME, EMAIL, CONTACT_NUMBER, ACCOUNT_TYPE, CREATED_AT, UPDATED_AT FROM ACCOUNT WHERE ACCOUNT_ID = :id`, { id: req.params.id });
    if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/accounts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };
    if (data.password) data.password = bcrypt.hashSync(data.password, 10);

    const fields = Object.keys(data);
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    const setSql = fields.map((f, i) => `${f === 'password' ? 'PASSWORD_HASH' : f} = :v${i}`).join(', ');
    const binds = {};
    fields.forEach((f, i) => binds[`v${i}`] = data[f]);
    binds.id = id;

    const sql = `UPDATE ACCOUNT SET ${setSql}, UPDATED_AT = SYSTIMESTAMP WHERE ACCOUNT_ID = :id`;
    await exec(sql, binds, { autoCommit: true });
    res.json({ message: 'Account updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/accounts/:id', async (req, res) => {
  try {
    await exec(`DELETE FROM ACCOUNT WHERE ACCOUNT_ID = :id`, { id: req.params.id }, { autoCommit: true });
    res.json({ message: 'Account deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------- ANNOUNCEMENT -----------------
// Create announcement
app.post('/api/announcements', async (req, res) => {
  try {
    const { title, details, created_by, message, audience, type, start_date, end_date } = req.body;
    const sql = `
      INSERT INTO ANNOUNCEMENT (ANNOUNCEMENT_ID, TITLE, DETAILS, CREATED_BY, CREATED_AT, MESSAGE, AUDIENCE, TYPE, START_DATE, END_DATE, UPDATED_AT)
      VALUES (announcement_seq.NEXTVAL, :title, :details, :created_by, SYSTIMESTAMP, :message, :audience, :type, TO_DATE(:start_date,'YYYY-MM-DD'), TO_DATE(:end_date,'YYYY-MM-DD'), SYSTIMESTAMP)
      RETURNING ANNOUNCEMENT_ID INTO :id
    `;
    const binds = { title, details, created_by, message, audience, type, start_date, end_date, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } };
    const r = await exec(sql, binds, { autoCommit: true });
    res.status(201).json({ message: 'Announcement created', announcement_id: r.outBinds.id[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Read all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const r = await exec(`SELECT ANNOUNCEMENT_ID, TITLE, CREATED_BY, AUDIENCE, START_DATE, END_DATE, UPDATED_AT FROM ANNOUNCEMENT ORDER BY CREATED_AT DESC`);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Read announcement by id
app.get('/api/announcements/:id', async (req, res) => {
  try {
    const r = await exec(`SELECT * FROM ANNOUNCEMENT WHERE ANNOUNCEMENT_ID = :id`, { id: req.params.id });
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update announcement
app.put('/api/announcements/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const fields = Object.keys(data);
    if (!fields.length) return res.status(400).json({ error: 'No fields' });
    const setSql = fields.map((f, i) => `${f} = :v${i}`).join(', ');
    const binds = {};
    fields.forEach((f, i) => binds[`v${i}`] = data[f]);
    binds.id = id;
    await exec(`UPDATE ANNOUNCEMENT SET ${setSql}, UPDATED_AT = SYSTIMESTAMP WHERE ANNOUNCEMENT_ID = :id`, binds, { autoCommit: true });
    res.json({ message: 'Announcement updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete announcement
app.delete('/api/announcements/:id', async (req, res) => {
  try {
    await exec(`DELETE FROM ANNOUNCEMENT WHERE ANNOUNCEMENT_ID = :id`, { id: req.params.id }, { autoCommit: true });
    res.json({ message: 'Announcement deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------- REPORT -----------------
// Create report (returns new id)
app.post('/api/reports', async (req, res) => {
  try {
    const { submitted_by, updated_by, title, description, location, status, type, attachment_path } = req.body;
    const sql = `
      INSERT INTO REPORT (REPORT_ID, SUBMITTED_BY, TITLE, DESCRIPTION, LOCATION, STATUS, TYPE, ATTACHMENT_PATH, SUBMITTED_AT, UPDATED_AT)
      VALUES (report_seq.NEXTVAL, :submitted_by, :title, :description, :location, :status, :type, :attachment_path, SYSTIMESTAMP, SYSTIMESTAMP)
      RETURNING REPORT_ID INTO :id
    `;
    const binds = { submitted_by, title, description, location, status: status || 'PENDING', type, attachment_path, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } };
    const r = await exec(sql, binds, { autoCommit: true });
    res.status(201).json({ message: 'Report created', report_id: r.outBinds.id[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Read reports (list)
app.get('/api/reports', async (req, res) => {
  try {
    const r = await exec(`SELECT REPORT_ID, SUBMITTED_BY, TITLE, TYPE, LOCATION, STATUS, SUBMITTED_AT, UPDATED_AT FROM REPORT ORDER BY SUBMITTED_AT DESC`);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Read report by id
app.get('/api/reports/:id', async (req, res) => {
  try {
    const r = await exec(`SELECT * FROM REPORT WHERE REPORT_ID = :id`, { id: req.params.id });
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update report
app.put('/api/reports/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const fields = Object.keys(data);
    if (!fields.length) return res.status(400).json({ error: 'No fields' });
    const setSql = fields.map((f, i) => `${f} = :v${i}`).join(', ');
    const binds = {}; fields.forEach((f,i)=>binds[`v${i}`]=data[f]); binds.id=id;
    await exec(`UPDATE REPORT SET ${setSql}, UPDATED_AT = SYSTIMESTAMP WHERE REPORT_ID = :id`, binds, { autoCommit: true });
    res.json({ message: 'Report updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete report
app.delete('/api/reports/:id', async (req, res) => {
  try {
    await exec(`DELETE FROM REPORT WHERE REPORT_ID = :id`, { id: req.params.id }, { autoCommit: true });
    res.json({ message: 'Report deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------- CRIME -----------------
// Note: CRIME primary key is REPORT_ID (1:1). Insert crime after report exists.
app.post('/api/crimes', async (req, res) => {
  try {
    const { report_id, crime_category, suspect_description, victim_involved, injury_level, weapon_involved, evidence_details } = req.body;
    if (!report_id) return res.status(400).json({ error: 'report_id required' });
    const sql = `
      INSERT INTO CRIME (REPORT_ID, CRIME_CATEGORY, SUSPECT_DESCRIPTION, VICTIM_INVOLVED, INJURY_LEVEL, WEAPON_INVOLVED, EVIDENCE_DETAILS)
      VALUES (:report_id, :crime_category, :suspect_description, :victim_involved, :injury_level, :weapon_involved, :evidence_details)
    `;
    await exec(sql, { report_id, crime_category, suspect_description, victim_involved, injury_level, weapon_involved, evidence_details }, { autoCommit: true });
    res.status(201).json({ message: 'Crime record created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get all crimes
app.get('/api/crimes', async (req, res) => {
  try {
    const r = await exec(`SELECT REPORT_ID, CRIME_CATEGORY, SUSPECT_DESCRIPTION, VICTIM_INVOLVED, INJURY_LEVEL, WEAPON_INVOLVED, EVIDENCE_DETAILS FROM CRIME`);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get crime by report id
app.get('/api/crimes/report/:reportId', async (req, res) => {
  try {
    const r = await exec(`SELECT * FROM CRIME WHERE REPORT_ID = :rid`, { rid: req.params.reportId });
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update crime
app.put('/api/crimes/:reportId', async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const data = req.body;
    const fields = Object.keys(data);
    if (!fields.length) return res.status(400).json({ error: 'No fields' });
    const setSql = fields.map((f,i)=>`${f} = :v${i}`).join(', ');
    const binds = {}; fields.forEach((f,i)=>binds[`v${i}`]=data[f]); binds.rid = reportId;
    await exec(`UPDATE CRIME SET ${setSql} WHERE REPORT_ID = :rid`, binds, { autoCommit: true });
    res.json({ message: 'Crime updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete crime
app.delete('/api/crimes/:reportId', async (req, res) => {
  try {
    await exec(`DELETE FROM CRIME WHERE REPORT_ID = :rid`, { rid: req.params.reportId }, { autoCommit: true });
    res.json({ message: 'Crime deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------- FACILITY -----------------
app.post('/api/facilities', async (req, res) => {
  try {
    const { report_id, facility_type, severity_level, affected_equipment } = req.body;
    if (!report_id) return res.status(400).json({ error: 'report_id required' });
    await exec(`INSERT INTO FACILITY (REPORT_ID, FACILITY_TYPE, SEVERITY_LEVEL, AFFECTED_EQUIPMENT) VALUES (:r, :ft, :sv, :ae)`, { r: report_id, ft: facility_type, sv: severity_level, ae: affected_equipment }, { autoCommit: true });
    res.status(201).json({ message: 'Facility record created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/facilities', async (req,res)=> {
  try { const r = await exec(`SELECT * FROM FACILITY`); res.json(r.rows); } catch(e){ res.status(500).json({ error: e.message }); }
});
app.get('/api/facilities/:reportId', async (req,res)=> {
  try { const r = await exec(`SELECT * FROM FACILITY WHERE REPORT_ID = :r`, { r: req.params.reportId }); res.json(r.rows); } catch(e){ res.status(500).json({ error: e.message }); }
});
app.delete('/api/facilities/:reportId', async (req,res)=> {
  try { await exec(`DELETE FROM FACILITY WHERE REPORT_ID = :r`, { r: req.params.reportId }, { autoCommit:true }); res.json({ message: 'Facility deleted' }); } catch(e){ res.status(500).json({ error: e.message }); }
});
app.put('/api/facilities/:reportId', async (req,res)=> {
  try { const fields=Object.keys(req.body); if(!fields.length) return res.status(400).json({error:'No fields'}); const set=fields.map((f,i)=>`${f}=:v${i}`).join(', '); const binds={}; fields.forEach((f,i)=>binds[`v${i}`]=req.body[f]); binds.r=req.params.reportId; await exec(`UPDATE FACILITY SET ${set} WHERE REPORT_ID=:r`, binds, {autoCommit:true}); res.json({message:'Facility updated'}); } catch(e){ res.status(500).json({ error: e.message }); }
});

// ----------------- GENERATED_REPORT -----------------
app.post('/api/generated_reports', async (req,res)=> {
  try {
    const { generated_by, summary, date_range_start, date_range_end, report_category, report_data_type, report_data, requested_at, title } = req.body;
    const sql = `
      INSERT INTO GENERATED_REPORT (GENERATE_ID, GENERATED_BY, SUMMARY, DATE_RANGE_START, DATE_RANGE_END, REPORT_CATEGORY, REPORT_DATA_TYPE, REPORT_DATA, REQUESTED_AT, TITLE)
      VALUES (generated_report_seq.NEXTVAL, :gen_by, :summary, TO_DATE(:drs,'YYYY-MM-DD'), TO_DATE(:dre,'YYYY-MM-DD'), :rc, :rdt, :rd, TO_DATE(:req,'YYYY-MM-DD'), :title)
      RETURNING GENERATE_ID INTO :id
    `;
    const binds = { gen_by: generated_by, summary, drs: date_range_start, dre: date_range_end, rc: report_category, rdt: report_data_type, rd: report_data, req: requested_at, title, id:{dir:oracledb.BIND_OUT, type:oracledb.NUMBER} };
    const r = await exec(sql, binds, { autoCommit:true });
    res.status(201).json({ message:'Generated report created', generate_id: r.outBinds.id[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/generated_reports', async (req,res)=> {
  try { const r = await exec(`SELECT * FROM GENERATED_REPORT ORDER BY REQUESTED_AT DESC`); res.json(r.rows); } catch(e){ res.status(500).json({ error: e.message }); }
});
app.get('/api/generated_reports/:id', async (req,res)=> {
  try { const r = await exec(`SELECT * FROM GENERATED_REPORT WHERE GENERATE_ID = :id`, { id: req.params.id }); if(!r.rows.length) return res.status(404).json({ error:'Not found' }); res.json(r.rows[0]); } catch(e){ res.status(500).json({ error: e.message }); }
});
app.delete('/api/generated_reports/:id', async (req,res)=> {
  try { await exec(`DELETE FROM GENERATED_REPORT WHERE GENERATE_ID = :id`, { id: req.params.id }, { autoCommit:true }); res.json({ message:'Deleted' }); } catch(e){ res.status(500).json({ error: e.message }); }
});

// ----------------- REPORT_ASSIGNMENT -----------------
app.post('/api/report_assignments', async (req,res)=> {
  try {
    const { account_id, report_id, action_taken, additional_feedback } = req.body;
    const sql = `INSERT INTO REPORT_ASSIGNMENT (ASSIGNMENT_ID, ACCOUNT_ID, REPORT_ID, ACTION_TAKEN, ADDITIONAL_FEEDBACK, ASSIGNED_AT) VALUES (report_assignment_seq.NEXTVAL, :aid, :rid, :act, :fb, SYSTIMESTAMP) RETURNING ASSIGNMENT_ID INTO :id`;
    const binds = { aid: account_id, rid: report_id, act: action_taken, fb: additional_feedback, id:{dir:oracledb.BIND_OUT, type:oracledb.NUMBER} };
    const r = await exec(sql, binds, { autoCommit:true });
    res.status(201).json({ message:'Assignment created', assignment_id: r.outBinds.id[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/report_assignments', async (req,res)=> {
  try { const r = await exec(`SELECT * FROM REPORT_ASSIGNMENT ORDER BY ASSIGNED_AT DESC`); res.json(r.rows); } catch(e){ res.status(500).json({ error: e.message }); }
});
app.delete('/api/report_assignments/:id', async (req,res)=> { try{ await exec(`DELETE FROM REPORT_ASSIGNMENT WHERE ASSIGNMENT_ID = :id`, { id:req.params.id }, { autoCommit:true }); res.json({ message:'Deleted' }); }catch(e){ res.status(500).json({ error: e.message }); }});

// ----------------- STAFF -----------------
app.post('/api/staff', async (req,res)=> {
  try {
    const { account_id, role, department, position } = req.body;
    const sql = `INSERT INTO STAFF (ACCOUNT_ID, ROLE, DEPARTMENT, POSITION) VALUES (:aid, :role, :dept, :pos)`;
    await exec(sql, { aid: account_id, role, dept: department, pos: position }, { autoCommit:true });
    res.status(201).json({ message:'Staff record created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/staff', async (req,res)=> {
  try {
    const r = await exec(`SELECT S.ACCOUNT_ID, A.NAME, A.EMAIL, S.ROLE, S.DEPARTMENT, S.POSITION FROM STAFF S JOIN ACCOUNT A ON S.ACCOUNT_ID = A.ACCOUNT_ID`);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/staff/:id', async (req,res)=> {
  try { const r = await exec(`SELECT * FROM STAFF WHERE ACCOUNT_ID = :id`, { id:req.params.id }); if(!r.rows.length) return res.status(404).json({ error:'Not found' }); res.json(r.rows[0]); } catch(e){ res.status(500).json({ error: e.message }); }
});
app.put('/api/staff/:id', async (req,res)=> { try{ const fields=Object.keys(req.body); if(!fields.length) return res.status(400).json({ error:'No fields' }); const set=fields.map((f,i)=>`${f}=:v${i}`).join(', '); const binds={}; fields.forEach((f,i)=>binds[`v${i}`]=req.body[f]); binds.id=req.params.id; await exec(`UPDATE STAFF SET ${set} WHERE ACCOUNT_ID = :id`, binds, { autoCommit:true }); res.json({ message:'Staff updated' }); } catch(e){ res.status(500).json({ error: e.message }); }});
app.delete('/api/staff/:id', async (req,res)=> { try{ await exec(`DELETE FROM STAFF WHERE ACCOUNT_ID = :id`, { id:req.params.id }, { autoCommit:true }); res.json({ message:'Staff deleted' }); } catch(e){ res.status(500).json({ error: e.message }); }});

// ----------------- STUDENT -----------------
app.post('/api/students', async (req,res)=> {
  try {
    const { account_id, program, semester, year_of_study } = req.body;
    await exec(`INSERT INTO STUDENT (ACCOUNT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY) VALUES (:aid, :prog, :sem, :yos)`, { aid: account_id, prog: program, sem: semester, yos: year_of_study }, { autoCommit:true });
    res.status(201).json({ message:'Student record created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/students', async (req,res)=> {
  try { const r = await exec(`SELECT S.ACCOUNT_ID, A.NAME, A.EMAIL, S.PROGRAM, S.SEMESTER, S.YEAR_OF_STUDY FROM STUDENT S JOIN ACCOUNT A ON S.ACCOUNT_ID = A.ACCOUNT_ID`); res.json(r.rows); } catch(e){ res.status(500).json({ error: e.message }); }
});
app.get('/api/students/:id', async (req,res)=> { try{ const r = await exec(`SELECT * FROM STUDENT WHERE ACCOUNT_ID = :id`, { id:req.params.id }); if(!r.rows.length) return res.status(404).json({ error:'Not found' }); res.json(r.rows[0]); } catch(e){ res.status(500).json({ error: e.message }); }});
app.put('/api/students/:id', async (req,res)=> { try{ const fields=Object.keys(req.body); if(!fields.length) return res.status(400).json({ error:'No fields' }); const set=fields.map((f,i)=>`${f}=:v${i}`).join(', '); const binds={}; fields.forEach((f,i)=>binds[`v${i}`]=req.body[f]); binds.id=req.params.id; await exec(`UPDATE STUDENT SET ${set} WHERE ACCOUNT_ID = :id`, binds, { autoCommit:true }); res.json({ message:'Student updated' }); } catch(e){ res.status(500).json({ error: e.message }); }});
app.delete('/api/students/:id', async (req,res)=> { try{ await exec(`DELETE FROM STUDENT WHERE ACCOUNT_ID = :id`, { id:req.params.id }, { autoCommit:true }); res.json({ message:'Student deleted' }); } catch(e){ res.status(500).json({ error: e.message }); }});

// ----------------- EMERGENCY_INFO -----------------
app.post('/api/emergency', async (req,res)=> {
  try {
    const { name, address, phone, email, state, type, hotline } = req.body;
    const sql = `INSERT INTO EMERGENCY_INFO (EMERGENCY_ID, NAME, ADDRESS, PHONE, EMAIL, STATE, TYPE, HOTLINE, CREATED_AT, UPDATED_AT) VALUES (emergency_info_seq.NEXTVAL, :n, :a, :p, :e, :s, :t, :h, SYSDATE, SYSDATE) RETURNING EMERGENCY_ID INTO :id`;
    const binds = { n:name, a:address, p:phone, e:email, s:state, t:type, h:hotline, id:{dir:oracledb.BIND_OUT, type:oracledb.NUMBER} };
    const r = await exec(sql, binds, { autoCommit:true });
    res.status(201).json({ message:'Emergency created', emergency_id: r.outBinds.id[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/emergency', async (req,res)=> { try{ const r = await exec(`SELECT * FROM EMERGENCY_INFO ORDER BY NAME`); res.json(r.rows);}catch(e){ res.status(500).json({ error: e.message }); }});
app.get('/api/emergency/:id', async (req,res)=> { try{ const r = await exec(`SELECT * FROM EMERGENCY_INFO WHERE EMERGENCY_ID = :id`, { id:req.params.id }); if(!r.rows.length) return res.status(404).json({ error:'Not found' }); res.json(r.rows[0]); }catch(e){ res.status(500).json({ error: e.message }); }});
app.put('/api/emergency/:id', async (req,res)=> { try{ const fields=Object.keys(req.body); if(!fields.length) return res.status(400).json({ error:'No fields' }); const set=fields.map((f,i)=>`${f}=:v${i}`).join(', '); const binds={}; fields.forEach((f,i)=>binds[`v${i}`]=req.body[f]); binds.id=req.params.id; await exec(`UPDATE EMERGENCY_INFO SET ${set} WHERE EMERGENCY_ID = :id`, binds, { autoCommit:true }); res.json({ message:'Emergency updated' }); }catch(e){ res.status(500).json({ error: e.message }); }});
app.delete('/api/emergency/:id', async (req,res)=> { try{ await exec(`DELETE FROM EMERGENCY_INFO WHERE EMERGENCY_ID = :id`, { id:req.params.id }, { autoCommit:true }); res.json({ message:'Emergency deleted' }); }catch(e){ res.status(500).json({ error: e.message }); }});

// ----------------- UITM_AUXILIARY_POLICE -----------------
app.post('/api/police', async (req,res)=> {
  try {
    const { emergency_id, campus, column2 } = req.body;
    const sql = `INSERT INTO UITM_AUXILIARY_POLICE (EMERGENCY_ID, CAMPUS, COLUMN2) VALUES (uitm_auxiliary_police_seq.NEXTVAL, :campus, TO_TIMESTAMP(:col2,'YYYY-MM-DD HH24:MI:SS')) RETURNING EMERGENCY_ID INTO :id`;
    const binds = { campus, col2: column2, id:{dir:oracledb.BIND_OUT, type:oracledb.NUMBER} };
    const r = await exec(sql, binds, { autoCommit:true });
    res.status(201).json({ message:'Police record created', emergency_id: r.outBinds.id[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/police', async (req,res)=> { try{ const r = await exec(`SELECT * FROM UITM_AUXILIARY_POLICE`); res.json(r.rows);}catch(e){ res.status(500).json({ error: e.message }); }});
app.get('/api/police/:id', async (req,res)=> { try{ const r = await exec(`SELECT * FROM UITM_AUXILIARY_POLICE WHERE EMERGENCY_ID = :id`, { id:req.params.id }); if(!r.rows.length) return res.status(404).json({ error:'Not found' }); res.json(r.rows[0]); }catch(e){ res.status(500).json({ error: e.message }); }});
app.delete('/api/police/:id', async (req,res)=> { try{ await exec(`DELETE FROM UITM_AUXILIARY_POLICE WHERE EMERGENCY_ID = :id`, { id:req.params.id }, { autoCommit:true }); res.json({ message:'Police deleted' }); }catch(e){ res.status(500).json({ error: e.message }); }});

// ----------------- DASHBOARD STATS -----------------
app.get('/api/dashboard/stats', async (req,res)=> {
  try {
    const r1 = await exec(`SELECT COUNT(*) CNT FROM REPORT`);
    const r2 = await exec(`SELECT COUNT(*) CNT FROM REPORT WHERE STATUS = 'PENDING'`);
    const r3 = await exec(`SELECT COUNT(*) CNT FROM CRIME`);
    const r4 = await exec(`SELECT COUNT(*) CNT FROM STUDENT`);
    res.json({
      total_reports: r1.rows[0].CNT,
      pending_reports: r2.rows[0].CNT,
      total_crimes: r3.rows[0].CNT,
      total_users: r4.rows[0].CNT
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ----------------- START SERVER -----------------
const PORT = 3000;
app.listen(PORT, '0.0.0.0', ()=> {
  console.log('========================================');
  console.log('🚀 Cybercrime API Server Running');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('========================================');
});
