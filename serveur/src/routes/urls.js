const express = require("express");
const router = express.Router();

const fetchUrlstest = require("../services/test-fetch-urls").FetchTest;
const { fetchUrls, feast, markConsumed, saveUrls } = require("../services/urls");

/* GET all urls */
router.get("/", async function (req, res, next) {
  try {
    const urls = await fetchUrls();
    res.status(200).send(urls);
  } catch (error) {
    console.error(error);
  }
});

/* POST request for some url to feast */
router.post("/feast", async function (req, res, next) {
  try {
    const urls= await fetchUrlstest();
    //const urls = await feast(req.body.crawlerId, req.body.maxUrlsCount);
    res.status(200).send(urls);
    //await markConsumed(req.body.crawlerId, urls);

  } catch (error) {
    console.error(error);
  }
});

/*  
    req.body.captured ==================
    {
      url_parent: String,
      url_enfants: [String, String, ...],
      crawler_id: Int,
    }
 */
/* POST one to many urls */
router.post("/captured", async function (req, res, next) {
  try {
    const result = await saveUrls(req.body.captured);
    res.status(201).send(result);
  } catch (error) {
    res.status(404);
    console.error(error);
  }
});

module.exports = router;
