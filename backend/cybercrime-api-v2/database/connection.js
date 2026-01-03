require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || 'PDBADMIN',
  password: process.env.DB_PASSWORD || 'PDBADMIN',
  connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/CYBERCRIME',
};

module.exports = { dbConfig };
