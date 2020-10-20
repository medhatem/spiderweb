const express = require("express");
const router = express.Router();
const subscribe = require("../services/crawlers-manager").subscribe;

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    res.status(200).send({ some_exemple: "Hello World" });
  } catch (error) {
    console.error(error);
  }
});

/**
 * req.body
 * {
 *  secret: String
 * }
 */
router.post("/subscribe", async function (req, res, next) {
  try {
    const crawler_token = await subscribe(req.body.secret);

    if (!crawler_token) {
      res.status(403);
      return;
    }

    res.status(200).send({ crawler_token });
  } catch (error) {
    res.status(404);
    console.error(error);
  }
});

module.exports = router;
