const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number.parseInt(process.env.MYSQL_PORT, 10),
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD,
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected!');

  const sql = `CREATE DATABASE if not EXISTS ${process.env.MYSQL_DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`;

  con.query(sql, (err) => {
    if (err) {
      console.log(err.sqlMessage);
    } else {
      console.log('Database created');
    }

    process.exit();
  });
});
