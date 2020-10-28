const crypto = require("crypto");
const GetCrawlersSessionCollection = require("../conn-databases/mongodb").GetCrawlersSessionCollection;

const MS_PER_MINUTE = 60000;
const CRAWLER_LOGOUT_TIMEOUT = 10 * MS_PER_MINUTE; // ms

const authentication = async (authentication_token) => {
  session = await GetCrawlersSessionCollection().findOne({ crawler_token: { $eq: authentication_token } });
  if (!session) {
    return false;
  }

  const update_result = await GetCrawlersSessionCollection().updateOne(
    { crawler_token: { $eq: authentication_token } },
    { $set: { last_auth: new Date() } }
  );

  if (!update_result) {
    return false;
  }

  return session;
};

const deconnection = async (authentication_token) => {
  result = await GetCrawlersSessionCollection().updateOne(
    { crawler_token: { $eq: authentication_token } },
    { $set: { active: false } }
  );
  return result;
};

const subscribe = async (crawlers_secret) => {
  const secret = process.env.CRAWLER_TOKEN_SECRET;
  if (crawlers_secret != secret) {
    return false;
  }

  const now = new Date();
  const hash = crypto.createHash("sha1");
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
    .find({
      $and: [
        { active: { $eq: true } },
        { last_auth: { $gt: new Date(new Date() - CRAWLER_LOGOUT_TIMEOUT) } },
        { last_auth: { $lte: new Date() } },
      ],
    })
    .project({ _id: 0, crawler_token: 1 })
    .toArray();
  return result;
};

exports.authentication = authentication;
exports.subscribe = subscribe;
exports.deconnection = deconnection;
exports.allTokensOfActiveCrawlers = allTokensOfActiveCrawlers;
