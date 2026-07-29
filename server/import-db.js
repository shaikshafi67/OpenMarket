const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
  host: 'viaduct.proxy.rlwy.net',
  port: 26544,
  user: 'root',
  password: 'rddneiaupuzXUXEbOcNLpAHfNRvgxKIm',
  database: 'railway',
  multipleStatements: true
});

const sql = fs.readFileSync(path.join(__dirname, 'open_market.sql'), 'utf8');

connection.connect((err) => {
  if (err) { console.error('Connection error:', err.message); process.exit(1); }
  console.log('Connected to Railway MySQL');
  connection.query(sql, (err) => {
    if (err) console.error('Import error:', err.message);
    else console.log('Database imported successfully!');
    connection.end();
  });
});
