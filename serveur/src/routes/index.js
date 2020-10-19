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
    const result = await subscribe(req.body.secret);

    if (!result) {
      res.status(403);
      return;
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(404);
    console.error(error);
  }
});

module.exports = router;
