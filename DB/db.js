const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1111",
  database: "project-c",
});
db.connect();
module.exports = db;
