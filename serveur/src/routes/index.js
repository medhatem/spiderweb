const express = require("express");
const urls = require("../services/urls");
const router = express.Router();
const subscribe = require("../services/crawlers-manager").subscribe;

const { fetchUrlsGraph, init_stock } = require("../services/urls");

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    res.status(200).send({ some_exemple: "Hello World" });
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
});

/* GET all urls */
router.get("/graph", async function (req, res, next) {
  try {
    const urls = await fetchUrlsGraph(req.query.urlparent);
    res.status(200).send(urls);
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
});

router.post("/init", async (req, res, next) => {
  try {
    const urls = req.body.urls.split(",").map((url) => url.trim());
    const result = await init_stock(urls);
    if (!result) {
      res.status(304).send();
      return;
    }
    res.status(201).send({ message: "success" });
  } catch (error) {
    res.status(404).send();
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
      res.status(403).send();
      return;
    }

    res.status(200).send({ crawler_token });
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
});

module.exports = router;
