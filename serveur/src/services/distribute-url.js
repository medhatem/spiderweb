const crypto = require("crypto");
const hash = crypto.createHash("sha1");

const distributeUrl = (url, crawlers_states) => {
  hash.update(url);
  const url_hashed = hash.digest("hex");
  const crawler_id = +url_hashed % crawlers_states.count;
  return crawler_id;
};

module.exports = distributeUrl;
