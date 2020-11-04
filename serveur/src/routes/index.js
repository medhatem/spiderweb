const express = require("express");
const urls = require("../services/urls");
const router = express.Router();
const subscribe = require("../services/crawlers-manager").subscribe;

const { fetchAllUrlsGraph, fetchOneNodeUrlsGraph, init_stock } = require("../services/urls");

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    res.status(200).send({ Hello: "World" });
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
});

/**
 * GET tout le graph ou tout les parties du graph d'urls
 */
router.get("/graph", async function (req, res, next) {
  try {
    if (req.query.urlparent) {
      const urls = await fetchOneNodeUrlsGraph(req.query.urlparent);
      res.status(200).send(urls);
    } else {
      const urls = await fetchAllUrlsGraph();
      res.status(200).send(urls);
    }
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
});

/**
 * POST pour les urls initiaux pour debuter le feast
 */
router.post("/init", async (req, res, next) => {
  try {
    const urls = req.body.urls;
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
 * Cree une nouvelle session de crawler
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
