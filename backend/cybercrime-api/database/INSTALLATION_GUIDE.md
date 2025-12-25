# Oracle Database 19c Installation Guide
## Installing the Cybercrime Platform Schema on Docker

This guide walks you through deploying the complete database schema to Oracle 19c running in Docker using SQL Developer.

---

## Prerequisites

✅ **Docker** installed and running  
✅ **Oracle Database 19c** container running  
✅ **Oracle SQL Developer** installed ([Download](https://www.oracle.com/database/sqldeveloper/technologies/download/))  
✅ Schema file: `schema.sql` (located in this directory)

---

## Step 1: Verify Oracle Docker Container

### 1.1 Check if Container is Running

```bash
docker ps
```

Look for a container running Oracle 19c. If not running, start it:

```bash
docker start <container-name-or-id>
```

### 1.2 Get Container Details

Note these connection details:
- **Host**: `localhost` or `127.0.0.1`
- **Port**: `1521` (default) or check with `docker port <container-name>`
- **SID/Service Name**: Usually `ORCLCDB` or `ORCL`
- **Username**: `SYSTEM` or `SYS`
- **Password**: The password you set during container creation

### 1.3 Test Container Connection

```bash
docker exec -it <container-name> sqlplus system/<password>@localhost:1521/ORCLCDB
```

If successful, exit with:
```sql
EXIT;
```

---

## Step 2: Create Database User (Optional but Recommended)

Instead of using SYSTEM, create a dedicated user for the application.

### 2.1 Connect as SYSTEM

```bash
docker exec -it <container-name> sqlplus system/<password>@localhost:1521/ORCLCDB
```

### 2.2 Create User and Grant Privileges

```sql
-- Create user
CREATE USER cybercrime_app IDENTIFIED BY "YourSecurePassword123!";

-- Grant privileges
GRANT CONNECT, RESOURCE TO cybercrime_app;
GRANT CREATE SESSION TO cybercrime_app;
GRANT CREATE TABLE TO cybercrime_app;
GRANT CREATE SEQUENCE TO cybercrime_app;
GRANT CREATE TRIGGER TO cybercrime_app;
GRANT CREATE VIEW TO cybercrime_app;
GRANT UNLIMITED TABLESPACE TO cybercrime_app;

-- Verify user creation
SELECT username FROM all_users WHERE username = 'CYBERCRIME_APP';

EXIT;
```

---

## Step 3: Configure SQL Developer Connection

### 3.1 Open SQL Developer

Launch Oracle SQL Developer application.

### 3.2 Create New Connection

1. Click the **+** icon (New Connection) or right-click **Connections** → **New Connection**
2. Fill in the connection details:

| Field | Value |
|-------|-------|
| **Connection Name** | `Cybercrime Platform - Docker` |
| **Username** | `cybercrime_app` (or `SYSTEM`) |
| **Password** | Your password |
| **Save Password** | ✅ Check this |
| **Connection Type** | Basic |
| **Hostname** | `localhost` or `127.0.0.1` |
| **Port** | `1521` |
| **SID** | `ORCLCDB` (or use **Service Name** instead) |

### 3.3 Test Connection

Click **Test** button at the bottom left. You should see:
```
Status: Success
```

### 3.4 Connect

Click **Connect** (or **Save** then **Connect**).

---

## Step 4: Execute Schema Script

### 4.1 Open schema.sql in SQL Developer

**Method 1: File Menu**
1. Go to **File** → **Open**
2. Navigate to: `backend/cybercrime-api/database/schema.sql`
3. Click **Open**

**Method 2: Drag and Drop**
1. Drag `schema.sql` from file explorer
2. Drop it into SQL Developer's worksheet

### 4.2 Review the Script

The script contains:
- ✅ 12 Tables (ACCOUNT, STUDENT, STAFF, REPORT, CRIME, FACILITY, etc.)
- ✅ 9 Sequences (auto-incrementing IDs)
- ✅ 20+ Triggers (auto-populate IDs and timestamps)
- ✅ 15+ Indexes (performance optimization)
- ✅ Foreign key relationships
- ✅ Check constraints for enums
- ✅ Verification queries

### 4.3 Execute the Script

**Option A: Run as Script** (Recommended)
1. Click the **Run Script** button (📜 icon) or press **F5**
2. This executes the entire file sequentially
3. Watch the **Script Output** tab at the bottom

**Option B: Run Statement** (Not recommended for full schema)
- Use **Run Statement** (▶️) or **Ctrl+Enter** for individual commands

### 4.4 Monitor Execution

Watch for:
- ✅ `Sequence created.`
- ✅ `Table created.`
- ✅ `Trigger created.`
- ✅ `Index created.`

### 4.5 Check for Errors

If you see errors:
- **ORA-00955: name is already used** → Object already exists (safe to ignore if re-running)
- **ORA-02289: sequence does not exist** → Normal during DROP statements
- **ORA-04043: object does not exist** → Normal during DROP statements
- **ORA-00942: table or view does not exist** → Normal during initial DROP statements

Other errors need investigation.

---

## Step 5: Verify Installation

### 5.1 Check Tables Created

Run in SQL Developer worksheet:

```sql
SELECT table_name 
FROM user_tables 
ORDER BY table_name;
```

**Expected Output** (12 tables):
```
ACCOUNT
ANNOUNCEMENT
CRIME
EMERGENCY_INFO
FACILITY
GENERATED_REPORT
REPORT
REPORT_ASSIGNMENT
RESOLUTION
STAFF
STUDENT
UITM_AUXILIARY_POLICE
```

### 5.2 Check Sequences

```sql
SELECT sequence_name 
FROM user_sequences 
ORDER BY sequence_name;
```

**Expected Output** (9 sequences):
```
ACCOUNT_SEQ
ANNOUNCEMENT_SEQ
ASSIGNMENT_SEQ
EMERGENCY_SEQ
GENERATE_SEQ
REPORT_SEQ
RESOLUTION_SEQ
STAFF_SEQ
STUDENT_SEQ
```

### 5.3 Check Triggers

```sql
SELECT trigger_name, table_name 
FROM user_triggers 
ORDER BY table_name, trigger_name;
```

Should show triggers for each table (typically 2 per table: `_BI` and `_BU`).

### 5.4 Check Constraints

```sql
SELECT constraint_name, constraint_type, table_name 
FROM user_constraints 
WHERE constraint_type IN ('P', 'R', 'C')
ORDER BY table_name;
```

- **P** = Primary Key
- **R** = Foreign Key (Referential)
- **C** = Check Constraint

### 5.5 Run Verification Queries

The schema script includes verification queries at the end. Results should show:
- ✅ 12 tables
- ✅ 9 sequences
- ✅ 20+ triggers
- ✅ Multiple indexes

---

## Step 6: Update Backend Configuration

### 6.1 Update Connection String

Edit `backend/cybercrime-api/server.js` or your config file:

```javascript
const dbConfig = {
  user: 'cybercrime_app',          // or 'SYSTEM'
  password: 'YourSecurePassword123!',
  connectString: 'localhost:1521/ORCLCDB'  // or your service name
};
```

### 6.2 Create .env File

Create `backend/cybercrime-api/.env`:

```env
# Database Configuration
DB_USER=cybercrime_app
DB_PASSWORD=YourSecurePassword123!
DB_CONNECT_STRING=localhost:1521/ORCLCDB

# Application Configuration
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 6.3 Verify Connection from Node.js

```bash
cd backend/cybercrime-api
node -e "
const oracledb = require('oracledb');
oracledb.getConnection({
  user: 'cybercrime_app',
  password: 'YourSecurePassword123!',
  connectString: 'localhost:1521/ORCLCDB'
}).then(conn => {
  console.log('✅ Connected successfully!');
  return conn.close();
}).catch(err => console.error('❌ Error:', err));
"
```

---

## Step 7: Insert Test Data (Optional)

### 7.1 Create Test Admin Account

```sql
-- Insert admin account (password: Admin123!)
INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (
    account_seq.NEXTVAL,
    'admin@uitm.edu.my',
    '$2a$10$rQ9XZ7jxK5vJ3nQ7xK5vJ3nQ7xK5vJ3nQ7xK5vJ3nQ7xK5vJ3nQ7x', -- bcrypt hash
    'System Administrator',
    '0123456789',
    'STAFF',
    'ACTIVE'
);

-- Get the account ID
SELECT ACCOUNT_ID FROM ACCOUNT WHERE EMAIL = 'admin@uitm.edu.my';

-- Insert staff record (use the ACCOUNT_ID from above, e.g., 1000)
INSERT INTO STAFF (STAFF_ID, ACCOUNT_ID, ROLE, DEPARTMENT, POSITION)
VALUES (
    staff_seq.NEXTVAL,
    1000,  -- Replace with actual ACCOUNT_ID
    'SUPERADMIN',
    'IT Department',
    'System Administrator'
);

COMMIT;
```

### 7.2 Create Test Student Account

```sql
-- Insert student account (password: Student123!)
INSERT INTO ACCOUNT (ACCOUNT_ID, EMAIL, PASSWORD, FULL_NAME, PHONE, ACCOUNT_TYPE, STATUS)
VALUES (
    account_seq.NEXTVAL,
    'student@student.uitm.edu.my',
    '$2a$10$rQ9XZ7jxK5vJ3nQ7xK5vJ3nQ7xK5vJ3nQ7xK5vJ3nQ7xK5vJ3nQ7x',
    'Test Student',
    '0198765432',
    'STUDENT',
    'ACTIVE'
);

-- Get the account ID
SELECT ACCOUNT_ID FROM ACCOUNT WHERE EMAIL = 'student@student.uitm.edu.my';

-- Insert student record (use the ACCOUNT_ID from above, e.g., 1001)
INSERT INTO STUDENT (STUDENT_ID, ACCOUNT_ID, PROGRAM, SEMESTER, YEAR_OF_STUDY)
VALUES (
    student_seq.NEXTVAL,
    1001,  -- Replace with actual ACCOUNT_ID
    'Bachelor of Computer Science',
    3,
    2
);

COMMIT;
```

### 7.3 Insert Sample Emergency Contacts

```sql
-- UiTM Shah Alam Police Station
INSERT INTO EMERGENCY_INFO (NAME, CAMPUS, ADDRESS, PHONE, EMAIL, STATE, TYPE, OPERATING_HOURS)
VALUES (
    'UiTM Shah Alam Auxiliary Police',
    'Shah Alam',
    'Security Office, UiTM Shah Alam, 40450 Shah Alam, Selangor',
    '03-55443333',
    'security@uitm.edu.my',
    'Selangor',
    'Police',
    '24 Hours'
);

-- National Emergency - PDRM
INSERT INTO EMERGENCY_INFO (NAME, ADDRESS, PHONE, STATE, TYPE, HOTLINE, OPERATING_HOURS)
VALUES (
    'Royal Malaysia Police (PDRM)',
    'Bukit Aman, Kuala Lumpur',
    '999',
    'Federal Territory',
    'Police',
    '999',
    '24 Hours'
);

-- Fire Department
INSERT INTO EMERGENCY_INFO (NAME, ADDRESS, PHONE, STATE, TYPE, HOTLINE, OPERATING_HOURS)
VALUES (
    'Malaysian Fire and Rescue Department',
    'Jalan Hang Tuah, Kuala Lumpur',
    '994',
    'Federal Territory',
    'Fire',
    '994',
    '24 Hours'
);

COMMIT;
```

---

## Step 8: Start Backend Server

### 8.1 Install Dependencies

```bash
cd backend/cybercrime-api
npm install
```

### 8.2 Start Server

```bash
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 3001
📡 84+ API endpoints available
```

### 8.3 Test API Endpoints

```bash
# Health check
curl http://localhost:3001/api/health

# Get accounts (requires authentication)
curl http://localhost:3001/api/accounts
```

---

## Troubleshooting

### Connection Issues

**❌ ORA-12514: TNS:listener does not currently know of service**
- Check service name: `SELECT value FROM v$parameter WHERE name = 'service_names';`
- Try using SID instead of Service Name

**❌ ORA-01017: invalid username/password**
- Verify credentials in SQL Developer
- Check password expiry: `SELECT username, account_status FROM dba_users WHERE username = 'CYBERCRIME_APP';`

**❌ ORA-28000: account is locked**
- Unlock: `ALTER USER cybercrime_app ACCOUNT UNLOCK;`

**❌ Connection timeout**
- Check Docker container is running: `docker ps`
- Verify port mapping: `docker port <container-name>`
- Check firewall settings

### Schema Issues

**❌ ORA-01031: insufficient privileges**
- Grant missing privileges:
```sql
GRANT CREATE TABLE, CREATE SEQUENCE, CREATE TRIGGER TO cybercrime_app;
```

**❌ ORA-01950: no privileges on tablespace 'USERS'**
```sql
GRANT UNLIMITED TABLESPACE TO cybercrime_app;
```

**❌ Foreign key constraint violation**
- Ensure tables are created in correct order (schema script handles this)

### Application Issues

**❌ Cannot connect to database from Node.js**
- Install Oracle Instant Client:
  - macOS: `brew install instantclient-basic`
  - Linux: Download from Oracle website
- Set environment variable: `export LD_LIBRARY_PATH=/path/to/instantclient`

**❌ Module 'oracledb' not found**
```bash
npm install oracledb
```

---

## Maintenance Commands

### Backup Database

```bash
docker exec <container-name> sh -c \
  'exp userid=cybercrime_app/password file=/tmp/backup.dmp'
docker cp <container-name>:/tmp/backup.dmp ./backup.dmp
```

### Drop All Objects (Clean Slate)

```sql
-- Drop tables (in order to avoid FK constraints)
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

-- Drop sequences
DROP SEQUENCE account_seq;
DROP SEQUENCE student_seq;
DROP SEQUENCE staff_seq;
DROP SEQUENCE report_seq;
DROP SEQUENCE announcement_seq;
DROP SEQUENCE assignment_seq;
DROP SEQUENCE emergency_seq;
DROP SEQUENCE generate_seq;
DROP SEQUENCE resolution_seq;
```

### Reset Sequences

```sql
-- Drop and recreate sequence
DROP SEQUENCE account_seq;
CREATE SEQUENCE account_seq START WITH 1000 INCREMENT BY 1 NOCACHE NOCYCLE;
```

### View All Installed Objects

```sql
SELECT object_type, COUNT(*) as count
FROM user_objects
WHERE object_type IN ('TABLE', 'SEQUENCE', 'TRIGGER', 'INDEX')
GROUP BY object_type
ORDER BY object_type;
```

---

## Next Steps

1. ✅ **Test all API endpoints** using Postman or curl
2. ✅ **Create seed data** for testing (use `7.1-7.3` above)
3. ✅ **Set up authentication** (JWT tokens)
4. ✅ **Run frontend** and test full integration
5. ✅ **Monitor logs** for any database errors
6. ✅ **Create backup schedule** for production

---

## Support

- **Oracle Documentation**: https://docs.oracle.com/en/database/oracle/oracle-database/19/
- **SQL Developer Guide**: https://docs.oracle.com/en/database/oracle/sql-developer/
- **Node.js oracledb**: https://oracle.github.io/node-oracledb/

---

**✅ Installation Complete!** Your Oracle database is now ready for the Cybercrime Platform.
