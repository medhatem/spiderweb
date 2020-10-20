const GetUrlsGraphCollection = require("../conn-databases/mongodb").GetUrlsGraphCollection;
const GetUrlsFeastCollection = require("../conn-databases/mongodb").GetUrlsFeastCollection;
const allTokensOfActiveCrawlers = require("../services/crawlers-manager").allTokensOfActiveCrawlers;
const Double = require("mongodb").Double;
const crypto = require("crypto");

const fetchUrlsGraph = async () => {
  const getAllDocs = await GetUrlsGraphCollection().find().toArray();
  return getAllDocs;
};

const createAfterFeastUpdateObject = (crawler_token, url) => {
  return {
    updateOne: { filter: { url }, update: { $set: { taken: true, taken_date: new Date(), taken_by: crawler_token } } },
  };
};

const markTaken = async (crawler_token, urls) => {
  if (!(urls && urls.length > 0)) {
    return false;
  }

  urls_update_array = urls.map((url) => createAfterFeastUpdateObject(crawler_token, url));
  const result = await GetUrlsFeastCollection().bulkWrite(urls_update_array);
  return result;
};

const feast = async (crawler_session, max_urls_count) => {
  const all_token = await allTokensOfActiveCrawlers();

  const crawler_current_index = all_token
    .map(({ crawler_token }, index) => ({
      crawler_token,
      index,
    }))
    .filter(({ crawler_token }) => crawler_token === crawler_session.crawler_token)[0].index;

  const token_count = all_token.length;

  const urls_not_consumed = (
    await GetUrlsFeastCollection()
      .find(
        {
          $and: [
            { taken: { $eq: false } },
            { distribution_number: { $mod: [token_count, crawler_current_index] } }, // distribution_number % token_count === crawler_current_index
          ],
        },
        { projection: { url: 1, _id: 0 } }
      )
      .limit(max_urls_count)
      .toArray()
  ).map(({ url }) => url);

  await markTaken(crawler_session.crawler_token, urls_not_consumed);

  return urls_not_consumed;
};

const urlToNumber = (url) => {
  hash = crypto.createHash("sha1");
  hash.update(url);
  const url_hashed = hash.digest("hex");
  const url_hashed_slice = url_hashed.slice(url_hashed.length - 13);
  return Number(`0x${url_hashed_slice}`);
};

const stock = async (crawler_session, sites) => {
  const stock_sites = sites.map(async (site) => {
    const url_enfants = Array.from(new Set(site.url_enfants));

    await GetUrlsGraphCollection().insertOne({
      url_parent: site.url_parent,
      url_enfants: url_enfants,
      creation_time: new Date(),
      crawler_token: crawler_session.crawler_token, // Crawler who has found the urls
      doc_version: 1,
    });

    await GetUrlsFeastCollection().insertMany(
      url_enfants.map((url) => ({
        url,
        distribution_number: Double(urlToNumber(url)),
        taken: false,
        taken_date: null,
        taken_by: null,
        creation_time: new Date(),
        doc_version: 1,
      }))
    );
  });

  const result = await Promise.all(stock_sites);
  return result;
};

module.exports = { fetchUrlsGraph, feast, stock };