const express = require("express");
const app = express();
const mysql = require("./mysql");
const fs = require("fs");
const bodyParser = require("body-parser");
const session = require("express-session");
const ejs = require("ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/html"));

app.use(
  session({
    HttpOnly: true,
    secure: true,
    secret: "1111", //환경변수 파일 따로 만들어서 설정
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24000 * 60 * 60 },
  })
);

app.get("*", function (req, res) {
  res.sendFile(__dirname + "/html/loginPage.html");
});

app.post("/main", function (req, res) {
  var id = String(req.body.id);
  var pw = String(req.body.pw);
  console.log(id, pw);
  var arr = mysql.login(id, pw);
  var list = mysql.list();
  setTimeout(() => {
    if (arr[0] === "id error") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<script>alert('없는 계정입니다.')</script>");
      res.write('<script>window.location="../"</script>');
    } else if (arr[0] === "pw error") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<script>alert('비밀번호가 틀렸습니다.')</script>");
      res.write('<script>window.location="../"</script>');
    } else {
      req.session.userid = arr[0].user_id;
      req.session.admin = arr[0].admin;
      req.session.save();
      fs.readFile("html/mainPage.ejs", "utf8", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          ejs.render(data, {
            id: req.session.userid,
            admin: req.session.admin,
            list: list[0],
          })
        );
      });
    }
  }, 1000); //promise 사용
});

app.listen(3000, function () {
  console.log("server start..");
});
