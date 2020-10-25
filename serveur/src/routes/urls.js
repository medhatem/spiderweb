const express = require("express");
const router = express.Router();

//const fetchUrls = require("../services/test-fetch-urls").FetchTest;
const { fetchUrlsGraph, feast, stock } = require("../services/urls");

/* GET all urls */
router.get("/", async function (req, res, next) {
  try {
    const urls = await fetchUrlsGraph(req.query.urlparent);
    res.status(200).send(urls);
  } catch (error) {
    res.status(404);
    console.error(error);
  }
});

/*
  req.body.feast
  {
    maxUrlsCount: Int
  }
 */
/* POST request for some url to feast */
router.post("/feast", async function (req, res, next) {
  try {
    const urls = await feast(req.session, req.body.maxUrlsCount);
    res.status(200).send(urls);
  } catch (error) {
    res.status(404);
    console.error(error);
  }
});

/*  
    req.body.sites ==================
    [
      {
        url_parent: String,
        url_enfants: [String, String, ...],
      },
      {...},
      .
      .
      .
    ]
 */
/* POST one to many urls */
router.post("/sites", async function (req, res, next) {
  try {
    console.log(req.body.sites);
    const result = await stock(req.session, req.body.sites);
    res.status(201).send({ message: "success" });
  } catch (error) {
    res.status(404);
    console.error(error);
  }
});

module.exports = router;
