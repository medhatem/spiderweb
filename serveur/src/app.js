const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const urlsRouter = require("./routes/urls");
const crawlers_auth_mw = require("./routes/crawlers-auth-middleware");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use(crawlers_auth_mw);
app.use("/urls", urlsRouter);
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
});

module.exports = app;
