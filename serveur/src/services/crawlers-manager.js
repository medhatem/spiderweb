const crypto = require("crypto");
const GetCrawlersSessionCollection = require("../conn-databases/mongodb").GetCrawlersSessionCollection;

const hash = crypto.createHash("sha1");
const secret = process.env.CRAWLER_TOKEN_SECRET;

const authentication = async (authentication_token) => {
  result = await GetCrawlersSessionCollection().findOne({ crawler_token: { $eq: authentication_token } });
  return result;
};

const deconnection = async (authentication_token) => {
  result = await GetCrawlersSessionCollection().updateOne(
    { crawler_token: { $eq: authentication_token } },
    { $set: { active: false } }
  );
  return result;
};

const subscribe = async (crawlers_secret) => {
  if (crawlers_secret != secret) {
    return false;
  }

  const now = new Date();
  hash.update(now.getTime() + secret);
  const crawler_token = hash.digest("base64");

  const result = await GetCrawlersSessionCollection().insertOne({
    creation_time: now,
    last_auth: now,
    crawler_token,
    active: true,
  });

  if (!(result && result.insertedCount == 1)) {
    return false;
  }

  return crawler_token;
};

const allTokensOfActiveCrawlers = async () => {
  const result = await GetCrawlersSessionCollection()
    .find({ active: { $eq: true } }, { projection: { _id: 0, crawler_token: 1 } })
    .toArray();
  return result;
};

exports.authentication = authentication;
exports.subscribe = subscribe;
exports.deconnection = deconnection;
exports.allTokensOfActiveCrawlers = allTokensOfActiveCrawlers;
