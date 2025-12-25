require('dotenv').config(); // Add this at the top
const { exec, dbConfig } = require('./connection');

async function test() {
  console.log('=== Database Configuration ===');
  console.log('User:', dbConfig.user);
  console.log('Password:', dbConfig.password ? '***' : 'NOT SET');
  console.log('Connect String:', dbConfig.connectString);
  console.log('');
  
  try {
    console.log('Testing database connection...');
    const result = await exec('SELECT COUNT(*) as count FROM ACCOUNT');
    console.log('✅ Connection successful!');
    console.log('Account count:', result.rows[0].COUNT);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

test();