/**
 * Run this script to create the PASSWORD_RESET_TOKENS table
 * Usage: ts-node database/setup-password-reset.ts
 */

import oracledb from 'oracledb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const createTableSQL = `
CREATE TABLE PASSWORD_RESET_TOKENS (
    ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EMAIL VARCHAR2(255) NOT NULL,
    TOKEN_HASH VARCHAR2(255) NOT NULL,
    EXPIRES_AT TIMESTAMP NOT NULL,
    USED NUMBER(1) DEFAULT 0 NOT NULL CHECK (USED IN (0, 1)),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
)
`;

const createIndexes = [
  `CREATE INDEX idx_prt_token ON PASSWORD_RESET_TOKENS(TOKEN_HASH)`,
  `CREATE INDEX idx_prt_expires_at ON PASSWORD_RESET_TOKENS(EXPIRES_AT)`,
  `CREATE INDEX idx_prt_email_used ON PASSWORD_RESET_TOKENS(EMAIL, USED)`
];

async function setupPasswordResetTable() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await oracledb.getConnection({
      user: process.env.DB_USER || 'admin_user',
      password: process.env.DB_PASSWORD || 'admin_user123',
      connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/CYBERCRIME'
    });

    console.log('Connected to Oracle Database');

    // Check if table exists
    const checkTable = await connection.execute(
      `SELECT COUNT(*) as CNT FROM user_tables WHERE table_name = 'PASSWORD_RESET_TOKENS'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const tableExists = (checkTable.rows as any)[0].CNT > 0;

    if (tableExists) {
      console.log('⚠️  Table PASSWORD_RESET_TOKENS already exists');
      const response = await new Promise<string>((resolve) => {
        process.stdout.write('Do you want to drop and recreate it? (yes/no): ');
        process.stdin.once('data', (data) => {
          resolve(data.toString().trim().toLowerCase());
        });
      });

      if (response === 'yes' || response === 'y') {
        console.log('Dropping existing table...');
        await connection.execute('DROP TABLE PASSWORD_RESET_TOKENS CASCADE CONSTRAINTS');
        console.log('✓ Table dropped');
      } else {
        console.log('Exiting without changes');
        process.exit(0);
      }
    }

    // Create table
    console.log('Creating PASSWORD_RESET_TOKENS table...');
    await connection.execute(createTableSQL);
    console.log('✓ Table created');

    // Create indexes
    console.log('Creating indexes...');
    for (const indexSQL of createIndexes) {
      await connection.execute(indexSQL);
    }
    console.log('✓ Indexes created');

    await connection.commit();
    console.log('\n✅ Password reset table setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up password reset table:', error);
    if (connection) {
      await connection.rollback();
    }
    process.exit(1);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

setupPasswordResetTable();
