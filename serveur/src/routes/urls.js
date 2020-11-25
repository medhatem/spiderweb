const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { ErrorsValidation } = require("./errors-validation-middleware");

const { feast, stock } = require("../services/urls");

/* POST request for some url to feast */
router.post("/feast", [body("maxUrlsCount").notEmpty().isInt(), ErrorsValidation], async function (req, res, next) {
  try {
    const urls = await feast(req.session, req.body.maxUrlsCount);
    res.status(200).send(urls);
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
});

/* POST one to many urls */
router.post(
  "/sites",
  [
    body("sites").notEmpty().isArray(),
    body("sites.*.lien_principal").notEmpty().isURL(),
    body("sites.*.set_enfant").notEmpty().isArray(),
    body("sites.*.set_enfant.*").isURL(),
    ErrorsValidation,
  ],
  async function (req, res, next) {
    try {
      const result = await stock(req.session, req.body.sites);
      res.status(201).send({ message: "success" });
    } catch (error) {
      res.status(404).send();
      console.error(error);
    }
  }
);

module.exports = router;
