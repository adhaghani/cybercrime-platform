# Oracle Database Setup

These steps provision Oracle Database Free (21c) via Docker, create an application user, and apply the cybercrime platform schema.

## Prerequisites
- Docker Desktop running
- `sqlplus` or `sqlcl` available in your shell (comes with Oracle Instant Client)
- Ports 1521 (listener) and 5500 (EM Express) free

## 1) Start Oracle Database Free in Docker
```bash
docker run -d \
  --name oracle-free \
  -e ORACLE_PWD=SuperSecurePwd123 \
  -p 1521:1521 -p 5500:5500 \
  gvenzl/oracle-free:21
```
- Container exposes service name `FREEPDB1`. Adjust the password to your own secret.
- Check readiness: `docker logs -f oracle-free` until you see `DATABASE IS READY TO USE!`.

## 2) Create the application user
Connect as SYSDBA, then create a dedicated user with minimal privileges.
```bash
sqlplus sys/SuperSecurePwd123@localhost:1521/FREEPDB1 as sysdba <<'SQL'
CREATE USER CC_APP IDENTIFIED BY "ChangeMePwd1";
GRANT CONNECT, RESOURCE TO CC_APP;
ALTER USER CC_APP QUOTA UNLIMITED ON USERS;
SQL
```
Use a stronger password in real deployments.

## 3) Apply the schema
From the project root, run:
```bash
sqlplus CC_APP/ChangeMePwd1@localhost:1521/FREEPDB1 @backend/cybercrime-api/database/schema.sql
```
The script is idempotent: rerunning will drop and recreate objects (all data is lost).

## 4) Verify objects
Example checks (optional):
```sql
SELECT table_name FROM user_tables ORDER BY table_name;
SELECT sequence_name FROM user_sequences ORDER BY sequence_name;
SELECT trigger_name FROM user_triggers ORDER BY trigger_name;
```

## 5) Application configuration
Provide the connection string to the backend via environment variables (example):
- `ORACLE_USER=CC_APP`
- `ORACLE_PASSWORD=ChangeMePwd1`
- `ORACLE_CONNECT_STRING=localhost:1521/FREEPDB1`

A common `node-oracledb` connect descriptor: `CC_APP/ChangeMePwd1@localhost:1521/FREEPDB1`.

## 6) Maintenance notes
- Back up before rerunning `schema.sql` because it drops and recreates all tables.
- Update passwords regularly and avoid committing secrets.
- If you change the service name or port, update `ORACLE_CONNECT_STRING` accordingly.
