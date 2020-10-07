const GetUrlsCollection = require("../conn-databases/mongodb").GetUrlsCollection;

const fetchUrls = async () => {
  const getAllDocs = await GetUrlsCollection().find().toArray();
  return getAllDocs;
};

const feast = async (crawler_id, max_urls_count) => {
  const urls_not_consumed = await GetUrlsCollection()
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
  const result = await GetUrlsCollection().bulkWrite(urls_update_array);
  return result;
};

// const createSaveObjectUrl = () => {};

const saveUrls = async (captured) => {
  /* captured.url_enfants.map((url) => createSaveObjectUrl(url, captured.url_parent, captured.crawler_id));
  const result = await GetUrlsCollection().bulkWrite();
  return result; */
};

module.exports = { fetchUrls, feast, markConsumed, saveUrls };
