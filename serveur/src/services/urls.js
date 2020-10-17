const GetUrlsGraphCollection = require("../conn-databases/mongodb").GetUrlsGraphCollection;
const GetUrlsFeastCollection = require("../conn-databases/mongodb").GetUrlsFeastCollection;

const distributeUrl = require("./distribute-url");

const fetchUrlsGraph = async () => {
  const getAllDocs = await GetUrlsGraphCollection().find().toArray();
  return getAllDocs;
};

const feast = async (crawler_id, max_urls_count) => {
  const urls_not_consumed = await GetUrlsFeastCollection()
    .find({ consumed: { $eq: false }, crawler_id: { $eq: crawler_id } })
    .limit(max_urls_count)
    .toArray();

  return urls_not_consumed;
};

const createAfterFeastUpdateObject = (url) => {
  return { updateOne: { filter: { url }, update: { $set: { consumed: true } } } };
};

const markConsumed = async (crawler_id, max_urls_count) => {
  urls_update_array = max_urls_count.map(createAfterFeastUpdateObject);
  const result = await GetUrlsFeastCollection().bulkWrite(urls_update_array);
  return result;
};

const saveUrls = async (urls) => {
  const url_enfants = Array.from(new Set(urls.url_enfants));

  await GetUrlsGraphCollection().insertOne({
    url_parent: urls.url_parent,
    url_enfants: url_enfants,
    timestamp: new Date(),
    crawler_id: urls.crawler_id, // Crawler who has found the urls
    doc_version: 1,
  });

  /*
    TODO: Faire la partie qui calcul a qui va l'url ICI 
   */

  await GetUrlsFeastCollection().insertMany(
    url_enfants.map((url) => ({
      url,
      crawler_id: distributeUrl(url),
      consumed: false,
      doc_version: 1,
    }))
  );
};

module.exports = { fetchUrlsGraph, feast, markConsumed, saveUrls };
