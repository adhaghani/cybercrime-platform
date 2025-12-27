require('dotenv').config();
const oracledb = require('oracledb');

// Configure oracledb to automatically fetch CLOBs as strings
oracledb.fetchAsString = [oracledb.CLOB];

// Database Configuration
const dbConfig = {
  user: process.env.DB_USER || 'PDBADMIN',
  password: process.env.DB_PASSWORD || 'PDBADMIN',
  connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/CYBERCRIME'
};

// Database Helper Function
async function exec(sql, binds = {}, opts = {}) {
  let conn;
  opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(sql, binds, opts);
    if (opts.autoCommit) await conn.commit();
    return result;
  } catch (err) {
    console.error('Database Error:', err.message);
    throw err;
  } finally {
    if (conn) {
      try { 
        await conn.close(); 
      } catch (e) { 
        console.error('Connection close error:', e); 
      }
    }
  }
}

module.exports = { exec, dbConfig };
