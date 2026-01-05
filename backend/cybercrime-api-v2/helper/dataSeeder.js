/* eslint-disable no-console */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const oracledb = require('oracledb');

const { dbConfig } = require('../database/connection');

// Ensure CLOB columns come back as strings
oracledb.fetchAsString = [oracledb.CLOB];

// Default volumes; override with CLI args like --students=15 --staff=8 --reports=25
const defaults = {
	students: 3500,
	staff: 128,
	reports: 1000,
	reportAssignments: 600,
	resolutions: 700,
	announcements: 64,
	emergencies: 64,
	UiTMAuxiliaryPolice: 16,
	generatedReports: 6
};

const roles = ['STAFF', 'SUPERVISOR', 'ADMIN'];
const departments = ['IT Services', 'Campus Security', 'Student Affairs', 'Facilities', 'Health Services'];
const positions = ['Analyst', 'Officer', 'Coordinator', 'Specialist', 'Lead'];
const programs = ['Computer Science', 'Information Security', 'Business Administration', 'Mechanical Engineering', 'Communications'];
const campuses = ['Shah Alam', 'Seri Iskandar', 'Arau', 'Jengka', 'Dungun', 'Machang'];
const states = ['Selangor', 'Perak', 'Perlis', 'Pahang', 'Terengganu', 'Kelantan'];
const crimeCategories = ['THEFT', 'ASSAULT', 'VANDALISM', 'HARASSMENT'];
const facilityTypes = ['ELECTRICAL', 'PLUMBING', 'FURNITURE', 'INFRASTRUCTURE'];
const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const announcementTypes = ['GENERAL', 'EMERGENCY', 'EVENT'];
const announcementAudience = ['ALL', 'STUDENTS', 'STAFF'];
const announcementPriority = ['LOW', 'MEDIUM', 'HIGH'];
const reportCategories = ['CRIME', 'FACILITY', 'USER', 'ALL REPORTS'];
const reportDataTypes = [ 'SUMMARY', 'DETAILED'];
const resolutionTypes = ['RESOLVED', 'ESCALATED', 'DISMISSED'];

const passwordHash = bcrypt.hashSync('Password123!', 10);
const runNonce = Math.floor(Date.now() % 1e6); // numeric nonce for unique numeric IDs per run

function parseArgs() {  
	const args = process.argv.slice(2);
	const cfg = { ...defaults };

	args.forEach((arg) => {
		const match = arg.match(/^--([a-zA-Z]+)=(\d+)$/);
		if (!match) return;
		const [, key, value] = match;
		if (Object.prototype.hasOwnProperty.call(cfg, key)) {
			cfg[key] = Number(value);
		}
	});

	return cfg;
}

function pick(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function randomPhone() {
	const base = Math.floor(1000000 + Math.random() * 9000000);
	return `+60-1${Math.floor(Math.random() * 9)}-${base}`;
}

function randomEmail(ID,type) {
	if(type === 'STAFF'){
		return `${ID}@staff.uitm.edu.my`;
	}
	return `${ID}@student.uitm.edu.my`;
}

function randomSentence() {
	const sentences = [
		'Incident reported by on-site witness with supporting evidence.',
		'Follow-up required to confirm details with involved parties.',
		'Situation contained, awaiting supervisor review.',
		'Preliminary checks completed; further validation pending.'
	];
	return pick(sentences);
}

function randomDateWithin(daysBack = 365) {
	const now = new Date();
	const past = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
	return past;
}

function makeReportTitle(type) {
	const crimeTitles = ['Lost Laptop', 'Dormitory Vandalism', 'Harassment Complaint', 'Theft at Library'];
	const facilityTitles = ['Broken Air Conditioner', 'Water Leak in Lab', 'Lighting Failure', 'Lift Malfunction'];
	return type === 'CRIME' ? pick(crimeTitles) : pick(facilityTitles);
}

async function insertAccount(connection, payload) {
	const createdAt = payload.createdAt || randomDateWithin(365);
	const result = await connection.execute(
		`INSERT INTO ACCOUNT (ACCOUNT_ID, NAME, EMAIL, PASSWORD_HASH, CONTACT_NUMBER, AVATAR_URL, ACCOUNT_TYPE, CREATED_AT, UPDATED_AT)
		 VALUES (account_seq.NEXTVAL, :name, :email, :passwordHash, :contact, :avatar, :accountType, :createdAt, :updatedAt)
		 RETURNING ACCOUNT_ID INTO :id`,
		{
			name: payload.name,
			email: payload.email,
			passwordHash,
			contact: payload.contact,
			avatar: payload.avatar,
			accountType: payload.accountType,
			createdAt,
			updatedAt: createdAt,
			id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
		},
		{ autoCommit: false }
	);

	return result.outBinds.id[0];
}

async function seedStudents(connection, count) {
	const students = [];
	for (let i = 0; i < count; i += 1) {
		const name = `Student ${i + 1}`;
		const studentId = Number(`2${runNonce.toString().padStart(6, '0')}${i.toString().padStart(3, '0')}`);
		const accountId = await insertAccount(connection, {
			name,
			email: randomEmail(studentId, "STUDENT"),
			contact: randomPhone(),
			avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
			accountType: 'STUDENT'
		});

		const program = pick(programs);
		const semester = Math.floor(Math.random() * 6) + 1;
		const year = Math.min(semester, 4);

		await connection.execute(
			`UPDATE STUDENT
				 SET STUDENT_ID = :studentId,
						 PROGRAM = :program,
						 SEMESTER = :semester,
						 YEAR_OF_STUDY = :year
			 WHERE ACCOUNT_ID = :accountId`,
			{ studentId, program, semester, year, accountId },
			{ autoCommit: false }
		);

		students.push({ accountId, studentId });
	}
	return students;
}

async function seedStaff(connection, count) {
	const staff = [];
	for (let i = 0; i < count; i += 1) {
		const name = `Staff ${i + 1}`;
		const uniqueStaffId = Number(`5${runNonce.toString().padStart(4, '0')}${i.toString().padStart(3, '0')}`);
		const accountId = await insertAccount(connection, {
			name,
			email: randomEmail(uniqueStaffId, "STAFF"),
			contact: randomPhone(),
			avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
			accountType: 'STAFF'
		});
		// Append runNonce to avoid uniqueness collisions across runs
		const role = pick(roles);
		const department = pick(departments);
		const position = pick(positions);
		const supervisor = staff.length ? pick(staff).accountId : null;

		await connection.execute(
			`UPDATE STAFF
				 SET STAFF_ID = :staffId,
						 ROLE = :role,
						 DEPARTMENT = :department,
						 POSITION = :position,
						 SUPERVISOR_ID = :supervisor
			 WHERE ACCOUNT_ID = :accountId`,
			{ staffId: uniqueStaffId, role, department, position, supervisor, accountId },
			{ autoCommit: false }
		);

		staff.push({ accountId, staffId: uniqueStaffId, role });
	}
	return staff;
}

// Ensure every STAFF member has a SUPERVISOR assigned to someone with role SUPERVISOR
async function assignSupervisors(connection, staff) {
	let supervisors = staff.filter((member) => member.role === 'SUPERVISOR');

	// If none exist, promote the first staff to supervisor for referential integrity
	if (!supervisors.length && staff.length) {
		const promoted = staff[0];
		promoted.role = 'SUPERVISOR';
		await connection.execute(
			"UPDATE STAFF SET ROLE = 'SUPERVISOR' WHERE ACCOUNT_ID = :accountId",
			{ accountId: promoted.accountId },
			{ autoCommit: false }
		);
		supervisors = [promoted];
	}

	if (!supervisors.length) return; // No staff to assign

	for (const member of staff) {
		if (member.role !== 'STAFF') continue;
		const supervisor = pick(supervisors);
		await connection.execute(
			`UPDATE STAFF SET SUPERVISOR_ID = :supervisorId WHERE ACCOUNT_ID = :accountId`,
			{ supervisorId: supervisor.accountId, accountId: member.accountId },
			{ autoCommit: false }
		);
	}
}

async function seedReports(connection, count, accounts, staff) {
	const reports = [];
	for (let i = 0; i < count; i += 1) {
		const type = Math.random() > 0.4 ? 'CRIME' : 'FACILITY';
		const title = makeReportTitle(type);
		const submittedBy = pick(accounts).accountId;
		const statusPool = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
		const status = pick(statusPool);
		const location = `${pick(campuses)} Campus Block ${Math.floor(Math.random() * 10) + 1}`;

		const result = await connection.execute(
			`INSERT INTO REPORT (REPORT_ID, SUBMITTED_BY, TITLE, DESCRIPTION, LOCATION, STATUS, TYPE, ATTACHMENT_PATH, SUBMITTED_AT, UPDATED_AT)
			 VALUES (report_seq.NEXTVAL, :submittedBy, :title, :description, :location, :status, :type, :attachment, :submittedAt, :updatedAt)
			 RETURNING REPORT_ID INTO :id`,
			{
				submittedBy,
				title,
				description: `${title} - ${randomSentence()}`,
				location,
				status,
				type,
				attachment: '/uploads/sample.pdf',
				submittedAt: randomDateWithin(40),
				updatedAt: new Date(),
				id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			},
			{ autoCommit: false }
		);

		const reportId = result.outBinds.id[0];

		if (type === 'CRIME') {
			await connection.execute(
				`UPDATE CRIME
						SET CRIME_CATEGORY = :category,
								SUSPECT_DESCRIPTION = :suspect,
								VICTIM_INVOLVED = :victim,
								INJURY_LEVEL = :injury,
								WEAPON_INVOLVED = :weapon,
								EVIDENCE_DETAILS = :evidence
					WHERE REPORT_ID = :reportId`,
				{
					category: pick(crimeCategories),
					suspect: 'Individual observed near the scene wearing dark jacket.',
					victim: 'Student witness provided contact details.',
					injury: 'Minor',
					weapon: 'None observed',
					evidence: 'CCTV footage requested from security office.',
					reportId
				},
				{ autoCommit: false }
			);
		} else {
			await connection.execute(
				`UPDATE FACILITY
						SET FACILITY_TYPE = :facilityType,
								SEVERITY_LEVEL = :severity,
								AFFECTED_EQUIPMENT = :equipment
					WHERE REPORT_ID = :reportId`,
				{
					facilityType: pick(facilityTypes),
					severity: pick(severities),
					equipment: 'Equipment inspected; maintenance ticket created.',
					reportId
				},
				{ autoCommit: false }
			);
		}

		const assignedTo = Math.random() > 0.5 && staff.length ? pick(staff).accountId : null;
		reports.push({ reportId, type, status, submittedBy, assignedTo });
	}
	return reports;
}

async function seedAssignments(connection, count, reports, staff) {
	if (!reports.length || !staff.length) return [];
	const assignments = [];
	for (let i = 0; i < count; i += 1) {
		const report = pick(reports);
		const assignee = pick(staff);

		const result = await connection.execute(
			`INSERT INTO REPORT_ASSIGNMENT (ASSIGNMENT_ID, ACCOUNT_ID, REPORT_ID, ASSIGNED_AT, ACTION_TAKEN, ADDITIONAL_FEEDBACK, UPDATED_AT)
			 VALUES (assignment_seq.NEXTVAL, :accountId, :reportId, :assignedAt, :actionTaken, :feedback, :updatedAt)
			 RETURNING ASSIGNMENT_ID INTO :id`,
			{
				accountId: assignee.accountId,
				reportId: report.reportId,
				assignedAt: randomDateWithin(20),
				actionTaken: 'Initial review completed; stakeholder contacted.',
				feedback: randomSentence(),
				updatedAt: new Date(),
				id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			},
			{ autoCommit: false }
		);

		assignments.push({ id: result.outBinds.id[0], reportId: report.reportId, accountId: assignee.accountId });
	}
	return assignments;
}

async function seedResolutions(connection, count, reports, staff) {
	if (!reports.length || !staff.length) return [];
	const limit = Math.min(count, reports.length);
	const chosenReports = [...reports].sort(() => 0.5 - Math.random()).slice(0, limit);
	const resolutions = [];

	for (let i = 0; i < chosenReports.length; i += 1) {
		const report = chosenReports[i];
		const resolver = pick(staff);
		const resolutionType = pick(resolutionTypes);
		const resolvedAt = randomDateWithin(15);

		const result = await connection.execute(
			`INSERT INTO RESOLUTION (RESOLUTION_ID, REPORT_ID, RESOLVED_BY, RESOLUTION_TYPE, RESOLUTION_SUMMARY, EVIDENCE_PATH, RESOLVED_AT)
			 VALUES (resolution_seq.NEXTVAL, :reportId, :resolvedBy, :resolutionType, :summary, :evidencePath, :resolvedAt)
			 RETURNING RESOLUTION_ID INTO :id`,
			{
				reportId: report.reportId,
				resolvedBy: resolver.accountId,
				resolutionType,
				summary: 'Resolution documented with supporting notes and follow-up steps.',
				resolvedAt,
				id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			},
			{ autoCommit: false }
		);

		// Align report status with resolution outcome for consistency
		const statusMap = {
			RESOLVED: 'RESOLVED',
			ESCALATED: 'IN_PROGRESS',
			DISMISSED: 'REJECTED',
			TRANSFERRED: 'IN_PROGRESS'
		};

		await connection.execute(
			`UPDATE REPORT SET STATUS = :status, UPDATED_AT = :updatedAt WHERE REPORT_ID = :reportId`,
			{ status: statusMap[resolutionType], updatedAt: new Date(), reportId: report.reportId },
			{ autoCommit: false }
		);

		resolutions.push({ id: result.outBinds.id[0], reportId: report.reportId });
	}
	return resolutions;
}

async function seedAnnouncements(connection, count, staff) {
	if (!staff.length) return [];
	const list = [];
	for (let i = 0; i < count; i += 1) {
		const creator = pick(staff);
		const start = randomDateWithin(20);
		const end = new Date(start.getTime() + (Math.floor(Math.random() * 7) + 3) * 24 * 60 * 60 * 1000);
		const title = pick(['Campus Safety Update', 'Maintenance Notice', 'Emergency Drill', 'Service Interruption']);
		const message = `${title} scheduled for campus community. Please review the details and follow guidance.`;

		const result = await connection.execute(
			`INSERT INTO ANNOUNCEMENT (ANNOUNCEMENT_ID, CREATED_BY, TITLE, MESSAGE, AUDIENCE, TYPE, PRIORITY, STATUS, PHOTO_PATH, START_DATE, END_DATE)
			 VALUES (announcement_seq.NEXTVAL, :createdBy, :title, :message, :audience, :type, :priority, 'PUBLISHED', '/uploads/banner.jpg', :startDate, :endDate)
			 RETURNING ANNOUNCEMENT_ID INTO :id`,
			{
				createdBy: creator.accountId,
				title,
				message,
				audience: pick(announcementAudience),
				type: pick(announcementTypes),
				priority: pick(announcementPriority),
				startDate: start,
				endDate: end,
				id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			},
			{ autoCommit: false }
		);

		list.push({ id: result.outBinds.id[0] });
	}
	return list;
}

async function seedEmergencies(connection, count) {
	const list = [];
	const emergencyTypes = ['Police', 'Fire', 'Medical', 'Civil Defence'];
	for (let i = 0; i < count; i += 1) {
		const type = pick(emergencyTypes);
		const state = pick(states);
		const name = `${type} Desk`;
		const address = `${state}`;
		const phone = randomPhone();
		const email = `contact@alerts.my`;
		const hotline = `1-800-${Math.floor(100000 + Math.random() * 900000)}`;

		const result = await connection.execute(
			`INSERT INTO EMERGENCY_INFO (EMERGENCY_ID, NAME, ADDRESS, PHONE, EMAIL, STATE, TYPE, HOTLINE)
			 VALUES (emergency_seq.NEXTVAL, :name, :address, :phone, :email, :state, :type, :hotline)
			 RETURNING EMERGENCY_ID INTO :id`,
			{ name,address, phone, email, state, type, hotline, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
			{ autoCommit: false }
		);

		list.push({ id: result.outBinds.id[0] });
	}

	// Create auxiliary police entries for a subset of police emergency rows
	const policeEntries = list.filter((item) => item.type === 'Police');
	const samplePolice = policeEntries.slice(0, Math.min(3, policeEntries.length));
	for (const entry of samplePolice) {
		const campus = pick(campuses);
		await connection.execute(
			`INSERT INTO UITM_AUXILIARY_POLICE (EMERGENCY_ID, CAMPUS, OPERATING_HOURS)
			 VALUES (:emergencyId, :campus, '24/7')`,
			{ emergencyId: entry.id, campus: campus },
			{ autoCommit: false }
		);
	}

	return list;
}

async function seedUiTMAuxiliaryPolice(connection, count) {
	const list = [];
	for (let i = 0; i < count; i += 1) {
		const campus = pick(campuses);
		const address = `${campus} Campus Security Office`;
		const phone = randomPhone();
		const email = `auxpolice.${campus.toLowerCase().replace(/ /g, '')}@uitm.edu.my`;
		const state = pick(states);
		const hotline = `1-800-${Math.floor(100000 + Math.random() * 900000)}`;
		const type = 'Police';

		const emergencyResult = await connection.execute(
			`INSERT INTO EMERGENCY_INFO (EMERGENCY_ID, ADDRESS, PHONE, EMAIL, STATE, TYPE, HOTLINE, CREATED_AT, UPDATED_AT)
			 VALUES (emergency_seq.NEXTVAL, :address, :phone, :email, :state, :type, :hotline, SYSTIMESTAMP, SYSTIMESTAMP)
			 RETURNING EMERGENCY_ID INTO :id`,
			{
				address,
				phone,
				email,
				state,
				type,
				hotline,
				id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			},
			{ autoCommit: true }
		);

		const emergencyId = emergencyResult.outBinds.id[0];
		
		await connection.execute(
			`INSERT INTO UITM_AUXILIARY_POLICE (EMERGENCY_ID, CAMPUS, OPERATING_HOURS)
			 VALUES (:emergencyId, :campus, '24/7')`,
			{ emergencyId, campus },
			{ autoCommit: true }
		);

		list.push({ emergencyId, campus });
	}
	return list;

}

async function seedGeneratedReports(connection, count, staff, reports) {
	if (!staff.length || !reports.length) return [];
	const list = [];
	for (let i = 0; i < count; i += 1) {
		const generator = pick(staff);
		const days = Math.floor(Math.random() * 20) + 10;
		const start = randomDateWithin(60);
		const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
		const category = pick(reportCategories);
		const dataType = pick(reportDataTypes);
		const title = `${category} Overview ${i + 1}`;
		const reportSample = JSON.stringify({ summary: 'Auto-generated seed data', sampleReportId: pick(reports).reportId });

		const result = await connection.execute(
			`INSERT INTO GENERATED_REPORT (GENERATE_ID, GENERATED_BY, TITLE, SUMMARY, DATE_RANGE_START, DATE_RANGE_END, REPORT_CATEGORY, REPORT_DATA_TYPE, REPORT_DATA, REQUESTED_AT)
			 VALUES (generate_seq.NEXTVAL, :generatedBy, :title, :summary, :startDate, :endDate, :category, :dataType, :data, :requestedAt)
			 RETURNING GENERATE_ID INTO :id`,
			{
				generatedBy: generator.accountId,
				title,
				summary: 'Automated report seeded for testing dashboards.',
				startDate: start,
				endDate: end,
				category,
				dataType,
				data: reportSample,
				requestedAt: randomDateWithin(10),
				id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			},
			{ autoCommit: false }
		);

		list.push({ id: result.outBinds.id[0] });
	}
	return list;
}

async function seedAll() {
	const config = parseArgs();
	console.log('Seeding with config:', config);

	const connection = await oracledb.getConnection(dbConfig);
	try {
		const students = await seedStudents(connection, config.students);
		const staff = await seedStaff(connection, config.staff);
		await assignSupervisors(connection, staff);
		const accounts = [...students, ...staff];

		const reports = await seedReports(connection, config.reports, accounts, staff);
		await seedAssignments(connection, config.reportAssignments, reports, staff);
		await seedResolutions(connection, config.resolutions, reports, staff);
		await seedAnnouncements(connection, config.announcements, staff);
		await seedEmergencies(connection, config.emergencies);
		await seedUiTMAuxiliaryPolice(connection, config.UiTMAuxiliaryPolice);
		await seedGeneratedReports(connection, config.generatedReports, staff, reports);

		await connection.commit();
		console.log('✅ Seeding completed successfully');
	} catch (err) {
		console.error('❌ Seeding failed:', err.message);
		try {
			await connection.rollback();
		} catch (rollbackErr) {
			console.error('Rollback error:', rollbackErr.message);
		}
		process.exitCode = 1;
	} finally {
		await connection.close();
	}
}

seedAll();
