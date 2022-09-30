const db = require("./DB/db");

const mysql = {
  login: (id, pw) => {
    return new Promise((resolve, reject) => {
      var sql = `SELECT * FROM user_info where user_id =?`;
      //var arr = [];
      db.query(sql, [id], function (err, results, fields) {
        if (err) {
          console.log(err);
        }
        if (!results[0]) {
          //arr.push("id error");
          resolve("id error");
        } else if (results[0].user_pw !== pw) {
          //arr.push("pw error");
          resolve("pw error");
        } else {
          //arr.push(results[0]);
          resolve(results[0]);
        }
      });
    });
  },
  list: () => {
    return new Promise((resolve, reject) => {
      var sql = `SELECT * FROM list ORDER BY date desc LIMIT 10`;
      db.query(sql, function (err, results, fields) {
        if (err) {
          console.log(err);
        }
        resolve(results);
      });
    });
  },
  signIntest: (id, pw, name) => {
    return new Promise((resolve, reject) => {
      var sql = `SELECT * FROM user_info where user_id =?`;
      var arr = {};
      db.query(sql, [id], function (err, results, fields) {
        if (err) {
          console.log(err);
        }
        if (results[0]) {
          arr.id = "error";
        } else {
          arr.id = "ok";
        }
      });
      var sql = `SELECT * FROM user_info where user_name =?`;
      db.query(sql, [name], function (err, results, fields) {
        if (err) {
          console.log(err);
        }
        if (results[0]) {
          arr.name = "error";
        } else {
          arr.name = "ok";
        }
        resolve(arr);
      });
    });
  },
  signIn: (id, pw, name) => {
    var sql = `INSERT INTO user_info (user_id,user_pw,user_name) values (?,?,?)`;
    db.query(sql, [id, pw, name], function (err, results, fields) {
      if (err) {
        console.log(err);
      }
    });
  },
};

module.exports = mysql;
