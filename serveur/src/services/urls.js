const GetUrlsGraphCollection = require("../conn-databases/mongodb").GetUrlsGraphCollection;
const GetUrlsFeastCollection = require("../conn-databases/mongodb").GetUrlsFeastCollection;

const distributeUrl = require("./distribute-url");

const fetchUrlsGraph = async () => {
  const getAllDocs = await GetUrlsGraphCollection().find().toArray();
  return getAllDocs;
};

const feast = async (crawler_token, max_urls_count) => {
  const urls_not_consumed = await GetUrlsFeastCollection()
    .findOne({ taken: { $eq: false } })
    .limit(max_urls_count)
    .toArray();

  return urls_not_consumed;
};

const createAfterFeastUpdateObject = (url) => {
  return { updateOne: { filter: { url }, update: { $set: { taken: true, taken_date: new Date() } } } };
};

const markTaken = async (max_urls_count) => {
  urls_update_array = max_urls_count.map(createAfterFeastUpdateObject);
  const result = await GetUrlsFeastCollection().bulkWrite(urls_update_array);
  return result;
};

const saveUrls = async (crawler_token, urls) => {
  const url_enfants = Array.from(new Set(urls.url_enfants));

  await GetUrlsGraphCollection().insertOne({
    url_parent: urls.url_parent,
    url_enfants: url_enfants,
    creation_time: new Date(),
    crawler_token, // Crawler who has found the urls
    doc_version: 1,
  });

  await GetUrlsFeastCollection().insertMany(
    url_enfants.map((url) => ({
      url,
      taken: false,
      taken_date: null,
      creation_time: new Date(),
      doc_version: 1,
    }))
  );
};

module.exports = { fetchUrlsGraph, feast, markTaken, saveUrls };
