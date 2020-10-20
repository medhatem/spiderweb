const GetUrlsGraphCollection = require("../conn-databases/mongodb").GetUrlsGraphCollection;
const GetUrlsFeastCollection = require("../conn-databases/mongodb").GetUrlsFeastCollection;
const allTokensOfActiveCrawlers = require("../services/crawlers-manager").allTokensOfActiveCrawlers;

const fetchUrlsGraph = async () => {
  const getAllDocs = await GetUrlsGraphCollection().find().toArray();
  return getAllDocs;
};

const createAfterFeastUpdateObject = (url) => {
  return { updateOne: { filter: { url }, update: { $set: { taken: true, taken_date: new Date() } } } };
};

const markTaken = async (urls) => {
  if (!(urls && urls.length > 0)) {
    return false;
  }

  urls_update_array = urls.map(createAfterFeastUpdateObject);
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

  const urls_not_consumed = (
    await GetUrlsFeastCollection()
      .find(
        {
          $expr: {
            $and: [
              { $eq: ["$taken", false] },
              { $eq: [{ $mod: [{ $toDouble: { $toString: "$_id" } }, all_token.length] }, crawler_current_index] },
            ],
          },
        }, // { $and: [{ taken: { $eq: false } }, { _id: { $mod: [all_token.length, crawler_current_index] } }] }
        { projection: { url: 1, _id: 0 } }
      )
      .limit(max_urls_count)
      .toArray()
  ).map(({ url }) => url);

  await markTaken(urls_not_consumed);

  return urls_not_consumed;
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
        taken: false,
        taken_date: null,
        creation_time: new Date(),
        doc_version: 1,
      }))
    );
  });

  const result = await Promise.all(stock_sites);
  return result;
};

module.exports = { fetchUrlsGraph, feast, stock };
