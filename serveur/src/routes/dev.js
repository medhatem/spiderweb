const express = require("express");
const router = express.Router();
const { reset, reset_crawlers } = require("../services/dev");

router.post("/reset", async function (req, res, next) {
  try {
    const { result_delete_graph, result_delete_feast } = await reset();
    if (result_delete_graph.error || result_delete_feast.error) {
      res.status(400).send({ message: "error" });
      return;
    }
    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
});

router.post("/reset-crawlers-session", async function (req, res, next) {
  try {
    const result_delete_crawler = await reset_crawlers();
    if (result_delete_crawler.error) {
      res.status(400).send({ message: "error" });
      return;
    }
    res.status(200).send({ message: "success" });
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
});

module.exports = router;
