const crypto = require("crypto");
const GetCrawlersCollection = require("../conn-databases/mongodb").GetCrawlersCollection;

const hash = crypto.createHash("sha1");
const secret = process.env.CRAWLER_TOKEN_SECRET;

const authentication = async (authentication_token) => {
  result = await GetCrawlersCollection().findOne({ token: { $eq: authentication_token } });
  return result;
};

const subscribe = async (crawlers_secret) => {
  if (crawlers_secret != secret) {
    return false;
  }

  const now = new Date();
  hash.update(now.getTime() + secret);
  const token = hash.digest("base64");
  await GetCrawlersCollection().insertOne({
    creation_time: now,
    last_auth: now,
    token,
    active: true,
  });
};

exports.authentication = authentication;
exports.subscribe = subscribe;
