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
}; //메세지를 alert 한 뒤 이전페이지로 돌아감.

app.post("/login", function (req, res) {
  var id = String(req.body.id);
  var pw = String(req.body.pw);
  mysql.login(id, pw).then((value) => {
    console.log(value);
    if (value === "id error") {
      alert(res, "<script>alert('없는 계정입니다.')</script>");
    } else if (value === "pw error") {
      alert(res, "<script>alert('비밀번호가 틀렸습니다')</script>");
    } else {
      req.session.userid = value.user_id;
      req.session.admin = value.admin;
      req.session.save();
      return res.redirect("/main");
    }
  });
});

app.get("/main", function (req, res) {
  mysql.list().then((value) => {
    fs.readFile("html/mainPage.ejs", "utf8", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        ejs.render(data, {
          id: req.session.userid,
          admin: req.session.admin,
          list: value,
        })
      );
    });
  });
});

app.get("/signIn", function (req, res) {
  res.sendFile(__dirname + "/html/signInPage.html");
});

app.post("/signIn/test", async function (req, res) {
  var id = String(req.body.id);
  var pw = String(req.body.pw);
  var name = String(req.body.name);
  const test = await mysql.signIntest(id, pw, name);
  console.log(test);
  if (test.id === "error" && test.name === "error") {
    alert(res, "<script>alert('ID,NAME 중복')</script>");
  } else if (test.id === "error" && test.name === "ok") {
    alert(res, "<script>alert('ID 중복')</script>");
  } else if (test.id === "ok" && test.name === "error") {
    alert(res, "<script>alert('NAME 중복')</script>");
  } else if (test.id === "ok" && test.name === "ok") {
    mysql.signIn(id, pw, name);
    console.log("ok");
  }
});

app.get("/main/make", function (req, res) {
  fs.readFile("html/makePage.ejs", "utf8", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      ejs.render(data, {
        id: req.session.userid,
        admin: req.session.admin,
      })
    );
  });
});

app.post("/main/make/test", function (req, res) {});

app.listen(3000, function () {
  console.log("server start..");
});
