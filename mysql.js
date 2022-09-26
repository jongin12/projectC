const db = require("./DB/db");

const mysql = {
  login: (id, pw) => {
    var sql = `SELECT * FROM user_info where user_id =?`;
    var arr = [];
    db.query(sql, [id], function (err, results, fields) {
      if (err) {
        console.log(err);
      }
      if (!results[0]) {
        arr.push("id error");
      } else if (results[0].user_pw !== pw) {
        arr.push("pw error");
      } else {
        arr.push(results[0]);
      }
    });
    return arr;
  },
  list: () => {
    var sql = `SELECT * FROM list ORDER BY date desc LIMIT 10`;
    var arr = [];
    db.query(sql, function (err, results, fields) {
      if (err) {
        console.log(err);
      }
      arr.push(results);
    });
    return arr;
  },
};

module.exports = mysql;