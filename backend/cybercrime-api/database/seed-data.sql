-- ============================================================================
-- SEED DATA FOR CYBERCRIME PLATFORM
-- ============================================================================
-- This script populates the database with sample data for testing
-- Execute this AFTER running schema.sql
-- ============================================================================

-- ============================================================================
-- 1. ACCOUNTS (Users)
-- ============================================================================

-- Admin accounts
INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (account_seq.NEXTVAL, 'superadmin@uitm.edu.my', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Super Administrator', '0123456789', 'STAFF', 'ACTIVE');

INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (account_seq.NEXTVAL, 'admin@uitm.edu.my', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Admin', '0123456788', 'STAFF', 'ACTIVE');

-- Staff accounts
INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (account_seq.NEXTVAL, 'supervisor@uitm.edu.my', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Security Supervisor', '0123456787', 'STAFF', 'ACTIVE');

INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (account_seq.NEXTVAL, 'staff1@uitm.edu.my', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Security Officer', '0123456786', 'STAFF', 'ACTIVE');

INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (account_seq.NEXTVAL, 'staff2@uitm.edu.my', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Security Officer', '0123456785', 'STAFF', 'ACTIVE');

-- Student accounts
INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (account_seq.NEXTVAL, 'student1@student.uitm.edu.my', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ahmad bin Abdullah', '0198765432', 'STUDENT', 'ACTIVE');

INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (account_seq.NEXTVAL, 'student2@student.uitm.edu.my', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Siti binti Hassan', '0198765431', 'STUDENT', 'ACTIVE');

INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (account_seq.NEXTVAL, 'student3@student.uitm.edu.my', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Kumar a/l Raju', '0198765430', 'STUDENT', 'ACTIVE');

INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (account_seq.NEXTVAL, 'student4@student.uitm.edu.my', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lee Wei Ming', '0198765429', 'STUDENT', 'ACTIVE');

COMMIT;

-- ============================================================================
-- 2. STAFF RECORDS
-- ============================================================================

-- Note: Match ACCOUNT_IDs from above (typically 1000-1004)
INSERT INTO STAFF (ACCOUNT_ID, ROLE, DEPARTMENT, POSITION, SUPERVISOR_ID)
VALUES (1000, 'SUPERADMIN', 'IT & Security', 'Super Administrator', NULL);

INSERT INTO STAFF (ACCOUNT_ID, ROLE, DEPARTMENT, POSITION, SUPERVISOR_ID)
VALUES (1001, 'ADMIN', 'IT & Security', 'System Administrator', 1000);

INSERT INTO STAFF (ACCOUNT_ID, ROLE, DEPARTMENT, POSITION, SUPERVISOR_ID)
VALUES (1002, 'SUPERVISOR', 'Security Department', 'Security Supervisor', 1000);

INSERT INTO STAFF (ACCOUNT_ID, ROLE, DEPARTMENT, POSITION, SUPERVISOR_ID)
VALUES (1003, 'STAFF', 'Security Department', 'Security Officer', 1002);

INSERT INTO STAFF (ACCOUNT_ID, ROLE, DEPARTMENT, POSITION, SUPERVISOR_ID)
VALUES (1004, 'STAFF', 'Security Department', 'Security Officer', 1002);

COMMIT;

-- ============================================================================
-- 3. STUDENT RECORDS
-- ============================================================================

-- Note: Match ACCOUNT_IDs from above (typically 1005-1008)
INSERT INTO STUDENT (ACCOUNT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY)
VALUES (1005, 'Bachelor of Computer Science', 3, 2);

INSERT INTO STUDENT (ACCOUNT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY)
VALUES (1006, 'Bachelor of Information Technology', 2, 1);

INSERT INTO STUDENT (ACCOUNT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY)
VALUES (1007, 'Bachelor of Software Engineering', 4, 2);

INSERT INTO STUDENT (ACCOUNT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY)
VALUES (1008, 'Bachelor of Business Administration', 1, 1);

COMMIT;

-- ============================================================================
-- 4. EMERGENCY CONTACTS (UiTM Police Stations)
-- ============================================================================

INSERT INTO EMERGENCY_INFO (NAME, CAMPUS, ADDRESS, PHONE, EMAIL, STATE, TYPE, OPERATING_HOURS)
VALUES ('UiTM Shah Alam Auxiliary Police', 'Shah Alam', 'Security Office, UiTM Shah Alam, 40450 Shah Alam, Selangor', '03-55443333', 'security.shahalam@uitm.edu.my', 'Selangor', 'Police', '24 Hours');

INSERT INTO EMERGENCY_INFO (NAME, CAMPUS, ADDRESS, PHONE, EMAIL, STATE, TYPE, OPERATING_HOURS)
VALUES ('UiTM Puncak Alam Auxiliary Police', 'Puncak Alam', 'Security Office, UiTM Puncak Alam, 42300 Puncak Alam, Selangor', '03-32584000', 'security.puncakalam@uitm.edu.my', 'Selangor', 'Police', '24 Hours');

INSERT INTO EMERGENCY_INFO (NAME, CAMPUS, ADDRESS, PHONE, EMAIL, STATE, TYPE, OPERATING_HOURS)
VALUES ('UiTM Johor Auxiliary Police', 'Segamat', 'Security Office, UiTM Johor, 85000 Segamat, Johor', '07-9352000', 'security.johor@uitm.edu.my', 'Johor', 'Police', '24 Hours');

INSERT INTO EMERGENCY_INFO (NAME, CAMPUS, ADDRESS, PHONE, EMAIL, STATE, TYPE, OPERATING_HOURS)
VALUES ('UiTM Melaka Auxiliary Police', 'Alor Gajah', 'Security Office, UiTM Melaka, 78000 Alor Gajah, Melaka', '06-5582000', 'security.melaka@uitm.edu.my', 'Melaka', 'Police', '24 Hours');

COMMIT;

-- ============================================================================
-- 5. NATIONAL EMERGENCY SERVICES
-- ============================================================================

INSERT INTO EMERGENCY_INFO (NAME, ADDRESS, PHONE, STATE, TYPE, HOTLINE, OPERATING_HOURS)
VALUES ('Royal Malaysia Police (PDRM)', 'Bukit Aman, Jalan Bukit Aman, 50560 Kuala Lumpur', '999', 'Federal Territory', 'Police', '999', '24 Hours');

INSERT INTO EMERGENCY_INFO (NAME, ADDRESS, PHONE, STATE, TYPE, HOTLINE, OPERATING_HOURS)
VALUES ('Malaysian Fire and Rescue Department (BOMBA)', 'Ibu Pejabat Bomba Dan Penyelamat Malaysia, Jalan Hang Tuah, 50560 Kuala Lumpur', '994', 'Federal Territory', 'Fire', '994', '24 Hours');

INSERT INTO EMERGENCY_INFO (NAME, ADDRESS, PHONE, STATE, TYPE, HOTLINE, OPERATING_HOURS)
VALUES ('Malaysian Civil Defence Force (APM)', 'Ibu Pejabat Angkatan Pertahanan Awam Malaysia, Jalan Padang Tembak, 50556 Kuala Lumpur', '999', 'Federal Territory', 'Civil Defence', '999', '24 Hours');

INSERT INTO EMERGENCY_INFO (NAME, ADDRESS, PHONE, STATE, TYPE, HOTLINE, OPERATING_HOURS)
VALUES ('Hospital Emergency Services', 'Ministry of Health Malaysia, Putrajaya', '999', 'Federal Territory', 'Medical', '999', '24 Hours');

COMMIT;

-- ============================================================================
-- 6. SAMPLE ANNOUNCEMENTS
-- ============================================================================

-- Note: CREATED_BY uses STAFF ACCOUNT_ID (1000)
INSERT INTO ANNOUNCEMENT (CREATED_BY, TITLE, MESSAGE, AUDIENCE, TYPE, PRIORITY, STATUS, START_DATE, END_DATE)
VALUES (
    1000,
    'New Cybersecurity Guidelines',
    'All students and staff are advised to review the updated cybersecurity guidelines. Please ensure you follow best practices for password management and report any suspicious activities immediately.',
    'ALL',
    'GENERAL',
    'HIGH',
    'PUBLISHED',
    SYSDATE,
    SYSDATE + 30
);

INSERT INTO ANNOUNCEMENT (CREATED_BY, TITLE, MESSAGE, AUDIENCE, TYPE, PRIORITY, STATUS, START_DATE, END_DATE)
VALUES (
    1000,
    'Cybercrime Awareness Workshop',
    'Join us for an interactive workshop on cybercrime awareness this Friday at 2 PM in Dewan Canselor. Learn about phishing, social engineering, and how to protect yourself online.',
    'STUDENTS',
    'EVENT',
    'MEDIUM',
    'PUBLISHED',
    SYSDATE,
    SYSDATE + 7
);

INSERT INTO ANNOUNCEMENT (CREATED_BY, TITLE, MESSAGE, AUDIENCE, TYPE, PRIORITY, STATUS, START_DATE, END_DATE)
VALUES (
    1001,
    'Security System Maintenance',
    'Campus security systems will undergo scheduled maintenance this Sunday from 2 AM to 6 AM. During this time, some digital services may be temporarily unavailable.',
    'STAFF',
    'GENERAL',
    'MEDIUM',
    'PUBLISHED',
    SYSDATE,
    SYSDATE + 5
);

INSERT INTO ANNOUNCEMENT (CREATED_BY, TITLE, MESSAGE, AUDIENCE, TYPE, PRIORITY, STATUS, START_DATE, END_DATE)
VALUES (
    1002,
    'Emergency Contact List Updated',
    'The emergency contact list has been updated with new hotlines. Please update your records and share with your department members.',
    'STAFF',
    'GENERAL',
    'LOW',
    'PUBLISHED',
    SYSDATE - 2,
    SYSDATE + 90
);

COMMIT;

-- ============================================================================
-- 7. SAMPLE CRIME REPORTS
-- ============================================================================

-- Student reports (SUBMITTED_BY = student ACCOUNT_ID)
INSERT INTO REPORT (SUBMITTED_BY, TYPE, TITLE, DESCRIPTION, LOCATION, STATUS, PRIORITY, INCIDENT_DATE)
VALUES (
    1005,
    'CRIME',
    'Phishing Email Attempt',
    'I received an email claiming to be from UiTM IT department asking for my student portal password. The email address looked suspicious.',
    'Student Email',
    'PENDING',
    'HIGH',
    SYSDATE - 1
);

INSERT INTO REPORT (SUBMITTED_BY, TYPE, TITLE, DESCRIPTION, LOCATION, STATUS, PRIORITY, INCIDENT_DATE)
VALUES (
    1006,
    'CRIME',
    'Suspicious Social Media Account',
    'Someone created a fake Facebook account using my photos and name. They are messaging my friends asking for money.',
    'Facebook',
    'UNDER_REVIEW',
    'HIGH',
    SYSDATE - 2
);

INSERT INTO REPORT (SUBMITTED_BY, TYPE, TITLE, DESCRIPTION, LOCATION, STATUS, PRIORITY, INCIDENT_DATE)
VALUES (
    1007,
    'CRIME',
    'Unauthorized Access to Email Account',
    'My UiTM email was accessed from an unknown location in China. I have received notification about password reset attempts.',
    'UiTM Email System',
    'IN_PROGRESS',
    'CRITICAL',
    SYSDATE - 3
);

INSERT INTO REPORT (SUBMITTED_BY, TYPE, TITLE, DESCRIPTION, LOCATION, STATUS, PRIORITY, INCIDENT_DATE)
VALUES (
    1008,
    'FACILITY',
    'Broken Security Camera',
    'The security camera near Block A parking lot has been damaged. This creates a blind spot for security monitoring.',
    'Block A Parking Lot',
    'PENDING',
    'MEDIUM',
    SYSDATE
);

INSERT INTO REPORT (SUBMITTED_BY, TYPE, TITLE, DESCRIPTION, LOCATION, STATUS, PRIORITY, INCIDENT_DATE)
VALUES (
    1005,
    'CRIME',
    'Online Harassment via WhatsApp',
    'I am receiving threatening messages from an unknown number on WhatsApp. The person claims to have my personal information.',
    'WhatsApp',
    'RESOLVED',
    'HIGH',
    SYSDATE - 10
);

COMMIT;

-- ============================================================================
-- 8. CRIME DETAILS (for CRIME type reports)
-- ============================================================================

-- Get REPORT_IDs from above (typically 1000-1004)
INSERT INTO CRIME (REPORT_ID, CRIME_TYPE, AFFECTED_DEVICE, IP_ADDRESS, EVIDENCE_PATH, POLICE_REPORT_FILED)
VALUES (1000, 'PHISHING', 'Student Laptop', '192.168.1.105', '/evidence/phishing_email_screenshot.png', 0);

INSERT INTO CRIME (REPORT_ID, CRIME_TYPE, AFFECTED_DEVICE, IP_ADDRESS, EVIDENCE_PATH, POLICE_REPORT_FILED)
VALUES (1001, 'IDENTITY_THEFT', 'Personal Phone', '203.0.113.45', '/evidence/fake_profile_screenshots.png', 1);

INSERT INTO CRIME (REPORT_ID, CRIME_TYPE, AFFECTED_DEVICE, IP_ADDRESS, EVIDENCE_PATH, POLICE_REPORT_FILED)
VALUES (1002, 'HACKING', 'UiTM Email Server', '101.53.124.88', '/evidence/login_logs.txt', 1);

INSERT INTO CRIME (REPORT_ID, CRIME_TYPE, AFFECTED_DEVICE, IP_ADDRESS, EVIDENCE_PATH, POLICE_REPORT_FILED)
VALUES (1004, 'ONLINE_HARASSMENT', 'Personal Phone', 'Unknown', '/evidence/whatsapp_screenshots.png', 1);

COMMIT;

-- ============================================================================
-- 9. FACILITY ISSUE DETAILS
-- ============================================================================

-- For FACILITY type report (REPORT_ID 1003)
INSERT INTO FACILITY (REPORT_ID, ISSUE_TYPE, BUILDING, FLOOR, ROOM, SEVERITY, ESTIMATED_REPAIR_TIME)
VALUES (1003, 'SECURITY_CAMERA', 'Block A', 'Ground Floor', 'Parking Lot', 'HIGH', 'Within 48 hours');

COMMIT;

-- ============================================================================
-- 10. REPORT ASSIGNMENTS
-- ============================================================================

-- Assign reports to staff members
INSERT INTO REPORT_ASSIGNMENT (ACCOUNT_ID, REPORT_ID, ACTION_TAKEN, ADDITIONAL_FEEDBACK)
VALUES (
    1003,
    1000,
    'Verified the phishing email headers. Forwarded to IT Security team. Advised student to ignore and delete.',
    'Email traced to known phishing campaign targeting Malaysian universities.'
);

INSERT INTO REPORT_ASSIGNMENT (ACCOUNT_ID, REPORT_ID, ACTION_TAKEN, ADDITIONAL_FEEDBACK)
VALUES (
    1004,
    1001,
    'Filed official report with Facebook. Contacted cybercrime unit. Advised student to warn all contacts.',
    'Fake account has been reported to Facebook and is pending review.'
);

INSERT INTO REPORT_ASSIGNMENT (ACCOUNT_ID, REPORT_ID, ACTION_TAKEN, ADDITIONAL_FEEDBACK)
VALUES (
    1003,
    1002,
    'Reset student email password. Enabled two-factor authentication. Reviewed access logs. Blocked suspicious IP.',
    'Student account has been secured. No data breach detected.'
);

INSERT INTO REPORT_ASSIGNMENT (ACCOUNT_ID, REPORT_ID, ACTION_TAKEN, ADDITIONAL_FEEDBACK)
VALUES (
    1002,
    1003,
    'Inspected camera. Ordered replacement parts. Arranged temporary mobile camera unit.',
    'Camera will be fixed within 48 hours. Maintenance team notified.'
);

COMMIT;

-- ============================================================================
-- 11. RESOLUTION (for closed reports)
-- ============================================================================

-- Resolve report 1004 (Report ID with RESOLVED status)
INSERT INTO RESOLUTION (REPORT_ID, RESOLVED_BY, RESOLUTION_TYPE, RESOLUTION_SUMMARY, EVIDENCE_PATH)
VALUES (
    1004,
    1003,
    'RESOLVED',
    'Police report filed. WhatsApp account blocked and reported. Student provided safety guidance and counseling referral.',
    '/evidence/police_report_copy.pdf'
);

COMMIT;

-- ============================================================================
-- 12. GENERATED REPORTS (Analytics)
-- ============================================================================

-- Sample generated report
INSERT INTO GENERATED_REPORT (GENERATED_BY, TITLE, SUMMARY, DATE_RANGE_START, DATE_RANGE_END, REPORT_CATEGORY, REPORT_DATA_TYPE, REPORT_DATA)
VALUES (
    1001,
    'Monthly Cybercrime Statistics - December 2024',
    'Summary of all cybercrime reports received in December 2024. Total of 25 reports with 15 resolved, 5 in progress, and 5 pending.',
    TO_DATE('2024-12-01', 'YYYY-MM-DD'),
    TO_DATE('2024-12-31', 'YYYY-MM-DD'),
    'CRIME',
    'JSON',
    '{"total_reports": 25, "resolved": 15, "in_progress": 5, "pending": 5, "crime_types": {"phishing": 8, "hacking": 6, "identity_theft": 5, "harassment": 6}}'
);

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify data insertion
SELECT 'ACCOUNTS' as TABLE_NAME, COUNT(*) as COUNT FROM ACCOUNT
UNION ALL
SELECT 'STAFF', COUNT(*) FROM STAFF
UNION ALL
SELECT 'STUDENTS', COUNT(*) FROM STUDENT
UNION ALL
SELECT 'EMERGENCY_INFO', COUNT(*) FROM EMERGENCY_INFO
UNION ALL
SELECT 'ANNOUNCEMENTS', COUNT(*) FROM ANNOUNCEMENT
UNION ALL
SELECT 'REPORTS', COUNT(*) FROM REPORT
UNION ALL
SELECT 'CRIMES', COUNT(*) FROM CRIME
UNION ALL
SELECT 'FACILITIES', COUNT(*) FROM FACILITY
UNION ALL
SELECT 'ASSIGNMENTS', COUNT(*) FROM REPORT_ASSIGNMENT
UNION ALL
SELECT 'RESOLUTIONS', COUNT(*) FROM RESOLUTION
UNION ALL
SELECT 'GENERATED_REPORTS', COUNT(*) FROM GENERATED_REPORT;

-- ============================================================================
-- TEST CREDENTIALS
-- ============================================================================
-- All passwords are hashed with bcrypt: "Password123!"
-- 
-- Super Admin:   superadmin@uitm.edu.my / Password123!
-- Admin:         admin@uitm.edu.my / Password123!
-- Supervisor:    supervisor@uitm.edu.my / Password123!
-- Staff 1:       staff1@uitm.edu.my / Password123!
-- Staff 2:       staff2@uitm.edu.my / Password123!
-- Student 1:     student1@student.uitm.edu.my / Password123!
-- Student 2:     student2@student.uitm.edu.my / Password123!
-- Student 3:     student3@student.uitm.edu.my / Password123!
-- Student 4:     student4@student.uitm.edu.my / Password123!
-- ============================================================================

-- Display summary
SELECT '✅ Seed data inserted successfully!' as STATUS FROM DUAL;
