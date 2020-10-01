const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    res.status(200).send({ some_exemple: "Hello World" });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;