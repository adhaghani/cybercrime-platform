# Database Schema and Installation

This directory contains all database-related files for the Cybercrime Platform running on Oracle Database 19c.

## 📁 Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **schema.sql** | Complete database schema with tables, sequences, triggers, and indexes | First-time setup or schema reset |
| **seed-data.sql** | Sample data for testing and development | After schema installation |
| **INSTALLATION_GUIDE.md** | Comprehensive step-by-step installation guide | Follow for Docker + SQL Developer setup |

## 🚀 Quick Start

### 1. Prerequisites
- ✅ Oracle Database 19c running in Docker
- ✅ Oracle SQL Developer installed
- ✅ Connection credentials ready

### 2. Installation Steps

```bash
# Step 1: Install Schema
# Open schema.sql in SQL Developer and execute (F5)

# Step 2: Insert Sample Data (Optional)
# Open seed-data.sql in SQL Developer and execute (F5)

# Step 3: Verify Installation
# Run verification queries in SQL Developer
```

### 3. Verify Installation

```sql
-- Check all tables created
SELECT table_name FROM user_tables ORDER BY table_name;

-- Expected: 12 tables
-- ACCOUNT, ANNOUNCEMENT, CRIME, EMERGENCY_INFO, FACILITY,
-- GENERATED_REPORT, REPORT, REPORT_ASSIGNMENT, RESOLUTION,
-- STAFF, STUDENT, UITM_AUXILIARY_POLICE

-- Check sample data (if seed-data.sql was run)
SELECT COUNT(*) FROM ACCOUNT;  -- Should return 9 accounts
SELECT COUNT(*) FROM REPORT;   -- Should return 5 reports
```

## 📊 Database Schema Overview

### Core Tables

```
ACCOUNT (9 accounts)
├── STUDENT (4 students)
└── STAFF (5 staff members)

REPORT (5 sample reports)
├── CRIME (4 crime reports)
├── FACILITY (1 facility issue)
├── REPORT_ASSIGNMENT (4 assignments)
└── RESOLUTION (1 resolution)

EMERGENCY_INFO (12 contacts)
├── UiTM Police Stations (4)
└── National Emergency Services (4)

ANNOUNCEMENT (4 announcements)
GENERATED_REPORT (1 sample report)
```

### Sequences (Auto-increment IDs)

- `account_seq` - ACCOUNT table
- `student_seq` - STUDENT table
- `staff_seq` - STAFF table
- `report_seq` - REPORT table
- `announcement_seq` - ANNOUNCEMENT table
- `assignment_seq` - REPORT_ASSIGNMENT table
- `emergency_seq` - EMERGENCY_INFO table
- `generate_seq` - GENERATED_REPORT table
- `resolution_seq` - RESOLUTION table

### Key Relationships

```
ACCOUNT (1) ──→ (1) STUDENT
ACCOUNT (1) ──→ (1) STAFF
ACCOUNT (1) ──→ (0..*) REPORT [submitted_by]
ACCOUNT (1) ──→ (0..*) REPORT_ASSIGNMENT [assigned_to]
REPORT (1) ──→ (0..1) CRIME
REPORT (1) ──→ (0..1) FACILITY
REPORT (1) ──→ (0..*) REPORT_ASSIGNMENT
REPORT (1) ──→ (0..1) RESOLUTION
STAFF (1) ──→ (0..*) STAFF [supervisor relationship]
```

## 🔐 Test Credentials

All accounts use the password: **Password123!**

| Email | Role | Department |
|-------|------|------------|
| superadmin@uitm.edu.my | SUPERADMIN | IT & Security |
| admin@uitm.edu.my | ADMIN | IT & Security |
| supervisor@uitm.edu.my | SUPERVISOR | Security Department |
| staff1@uitm.edu.my | STAFF | Security Department |
| staff2@uitm.edu.my | STAFF | Security Department |
| student1@student.uitm.edu.my | STUDENT | Computer Science |
| student2@student.uitm.edu.my | STUDENT | Information Technology |
| student3@student.uitm.edu.my | STUDENT | Software Engineering |
| student4@student.uitm.edu.my | STUDENT | Business Administration |

## 🛠️ Maintenance

### Reset Database

```sql
-- Drop all tables (removes data)
DROP TABLE RESOLUTION CASCADE CONSTRAINTS;
DROP TABLE GENERATED_REPORT CASCADE CONSTRAINTS;
DROP TABLE ANNOUNCEMENT CASCADE CONSTRAINTS;
DROP TABLE UITM_AUXILIARY_POLICE CASCADE CONSTRAINTS;
DROP TABLE EMERGENCY_INFO CASCADE CONSTRAINTS;
DROP TABLE REPORT_ASSIGNMENT CASCADE CONSTRAINTS;
DROP TABLE FACILITY CASCADE CONSTRAINTS;
DROP TABLE CRIME CASCADE CONSTRAINTS;
DROP TABLE REPORT CASCADE CONSTRAINTS;
DROP TABLE STAFF CASCADE CONSTRAINTS;
DROP TABLE STUDENT CASCADE CONSTRAINTS;
DROP TABLE ACCOUNT CASCADE CONSTRAINTS;

-- Recreate schema
@schema.sql
```

### Backup Database

```bash
# From host machine
docker exec <container-name> sh -c \
  'exp userid=cybercrime_app/password file=/tmp/backup.dmp'
docker cp <container-name>:/tmp/backup.dmp ./backup-$(date +%Y%m%d).dmp
```

### Restore Database

```bash
docker cp ./backup.dmp <container-name>:/tmp/backup.dmp
docker exec <container-name> sh -c \
  'imp userid=cybercrime_app/password file=/tmp/backup.dmp'
```

## 📚 Documentation

For detailed installation instructions, see:
- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Complete step-by-step guide
- **[../API_ROUTES.md](../API_ROUTES.md)** - API endpoints documentation

## 🔗 Useful Queries

### Check Database Stats

```sql
-- Table row counts
SELECT table_name, num_rows
FROM user_tables
ORDER BY table_name;

-- Sequence current values
SELECT sequence_name, last_number
FROM user_sequences
ORDER BY sequence_name;

-- Recent reports
SELECT r.REPORT_ID, r.TITLE, r.STATUS, a.FULL_NAME as SUBMITTED_BY
FROM REPORT r
JOIN ACCOUNT a ON r.SUBMITTED_BY = a.ACCOUNT_ID
ORDER BY r.SUBMITTED_AT DESC
FETCH FIRST 10 ROWS ONLY;

-- Staff workload
SELECT a.FULL_NAME, COUNT(ra.ASSIGNMENT_ID) as ASSIGNMENTS
FROM ACCOUNT a
JOIN STAFF s ON a.ACCOUNT_ID = s.ACCOUNT_ID
LEFT JOIN REPORT_ASSIGNMENT ra ON a.ACCOUNT_ID = ra.ACCOUNT_ID
GROUP BY a.FULL_NAME
ORDER BY ASSIGNMENTS DESC;
```

### Performance Monitoring

```sql
-- Check index usage
SELECT index_name, table_name, blevel, leaf_blocks
FROM user_indexes
ORDER BY table_name, index_name;

-- Find slow queries (requires AWR access)
SELECT sql_text, executions, elapsed_time/1000000 as elapsed_seconds
FROM v$sql
WHERE elapsed_time > 1000000
ORDER BY elapsed_time DESC;
```

## 🐛 Troubleshooting

### Common Issues

**ORA-00001: unique constraint violated**
- Solution: Sequences may be out of sync. Reset with `ALTER SEQUENCE <seq> RESTART START WITH <next_value>;`

**ORA-02291: integrity constraint violated**
- Solution: Parent record doesn't exist. Check foreign key relationships.

**ORA-01400: cannot insert NULL**
- Solution: Required field missing. Check table constraints.

**Slow queries**
- Solution: Verify indexes exist, run `ANALYZE TABLE <table> COMPUTE STATISTICS;`

### Getting Help

1. Check **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** troubleshooting section
2. Verify all prerequisites are met
3. Check Oracle logs: `docker logs <container-name>`
4. Run verification queries to confirm schema integrity

## 📊 Schema Statistics

- **Tables**: 12
- **Sequences**: 9
- **Triggers**: 18 (2 per table for BEFORE INSERT/UPDATE)
- **Indexes**: 15+ (performance optimization)
- **Constraints**: 40+ (PKs, FKs, CHECK constraints)
- **Sample Records**: 60+ (with seed-data.sql)

## ✅ Next Steps

After database setup:

1. ✅ Update backend `.env` with connection details
2. ✅ Test connection from Node.js backend
3. ✅ Start backend server: `npm start`
4. ✅ Test API endpoints with Postman
5. ✅ Run frontend and test full integration

---

**Need Help?** See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for detailed instructions.
