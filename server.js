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

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/loginPage.html");
});

const alert = (res, message) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.write(message);
  res.write('<script>window.location="./"</script>');
};

app.post("/main", function (req, res) {
  var id = String(req.body.id);
  var pw = String(req.body.pw);
  var arr = mysql.login(id, pw);
  var list = mysql.list();
  setTimeout(() => {
    if (arr[0] === "id error") {
      alert(res, "<script>alert('없는 계정입니다.')</script>");
    } else if (arr[0] === "pw error") {
      alert(res, "<script>alert('비밀번호가 틀렸습니다')</script>");
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

app.get("/signIn", function (req, res) {
  res.sendFile(__dirname + "/html/signInPage.html");
});

app.post("/signIn/test", function (req, res) {
  var id = String(req.body.id);
  var pw = String(req.body.pw);
  var name = String(req.body.name);
  var arr = mysql.signIntest(id, pw, name);
  console.log(id, pw, name);
  setTimeout(() => {
    if (arr.id === "error" && arr.name === "error") {
      alert(res, "<script>alert('ID,NAME 중복')</script>");
    } else if (arr.id === "error" && arr.name === "ok") {
      alert(res, "<script>alert('ID 중복')</script>");
    } else if (arr.id === "ok" && arr.name === "error") {
      alert(res, "<script>alert('NAME 중복')</script>");
    } else if (arr.id === "ok" && arr.name === "ok") {
      mysql.signIn(id, pw, name);
      console.log("ok");
    }
  }, 1000);
});

app.listen(3000, function () {
  console.log("server start..");
});
