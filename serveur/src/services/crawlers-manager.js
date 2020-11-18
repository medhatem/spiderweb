const crypto = require("crypto");
const GetCrawlersSessionCollection = require("../conn-databases/mongodb").GetCrawlersSessionCollection;

const MS_PER_MINUTE = 60000;
const CRAWLER_LOGOUT_TIMEOUT = 5 * MS_PER_MINUTE; // ms

/**
 * Les proprietes a satifsfaire pour qu'une session soit active
 */
const currently_active_session_properties = () => {
  return [
    { active: { $eq: true } },
    { last_auth: { $gt: new Date(new Date() - CRAWLER_LOGOUT_TIMEOUT) } },
    { last_auth: { $lte: new Date() } },
  ];
};

/**
 * Logique pour authentifier un crawler. Lui permet l'access pour feast et deposer des urls s'il a un token.
 * @param {*} authentication_token
 */
const authentication = async (authentication_token) => {
  // Trouve la session pour le token passer en param
  session = await GetCrawlersSessionCollection().findOne({
    $and: [{ crawler_token: { $eq: authentication_token } }, ...currently_active_session_properties()],
  });
  if (!session) {
    return false;
  }

  // Met l'heure et la date courant dans la bd comme moment d'authentification
  const update_result = await GetCrawlersSessionCollection().updateOne(
    { crawler_token: { $eq: authentication_token } },
    { $set: { last_auth: new Date() } }
  );

  if (!update_result) {
    return false;
  }

  return session;
};

/**
 * Si un crawler veut se deconnecter
 * @param {*} authentication_token
 */
const deconnection = async (authentication_token) => {
  result = await GetCrawlersSessionCollection().updateOne(
    { crawler_token: { $eq: authentication_token } },
    { $set: { active: false } }
  );
  return result;
};

/**
 * Un crawler peut subscribe avec le bon secret pour qui soit nourri en urls et puissent fournir des urls
 * @param {*} crawlers_secret
 */
const subscribe = async (crawlers_secret) => {
  // Verifie que le secret est correct. A AMELIORER
  const secret = process.env.CRAWLER_TOKEN_SECRET;
  if (crawlers_secret != secret) {
    return false;
  }

  // Creation du crawler token
  const now = new Date();
  const hash = crypto.createHash("sha1");
  hash.update(now.getTime() + secret);
  const crawler_token = hash.digest("base64");

  // Insert la session du nouveau crawler dans bd
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

/**
 * Va chercher tout les tokens des crawlers qui sont presentment actif.
 * Verifie que le last auth des crawlers n'est pas plus vieux qu'un certain delai de temps.
 */
const allTokensOfActiveCrawlers = async () => {
  const result = await GetCrawlersSessionCollection()
    .find({
      $and: [...currently_active_session_properties()],
    })
    .project({ _id: 0, crawler_token: 1 })
    .toArray();
  return result;
};

exports.authentication = authentication;
exports.subscribe = subscribe;
exports.deconnection = deconnection;
exports.allTokensOfActiveCrawlers = allTokensOfActiveCrawlers;
