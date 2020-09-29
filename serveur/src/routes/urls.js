const express = require("express");
const router = express.Router();

const fetchUrls = require("../services/test-fetch-urls").FetchTest;

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const urls = await fetchUrls();
    res.status(200).send(urls);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
