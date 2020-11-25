const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const indexRouter = require("./routes/index");
const urlsRouter = require("./routes/urls");
const devRouter = require("./routes/dev");
const crawlers_auth_mw = require("./routes/crawlers-auth-middleware");

const app = express();
app.use(cors());

// https://stackoverflow.com/questions/27230365/morgan-logger-express-js-writing-file-and-showing-in-console
// :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
app.use(
  logger("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "../access.log"), { flags: "a" }),
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/dev", devRouter);
app.use(crawlers_auth_mw);
app.use("/urls", urlsRouter);
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
});

module.exports = app;
