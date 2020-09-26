const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const object_to_send_as_json = {imExample: "Hello"};
  res.status(200).send(object_to_send_as_json);
});

module.exports = router;