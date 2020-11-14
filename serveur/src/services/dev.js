/**
 * Utils pour le developpement
 */
const {
  GetUrlsGraphCollection,
  GetUrlsFeastCollection,
  GetCrawlersSessionCollection,
} = require("../conn-databases/mongodb");

const reset = async () => {
  const result_delete_graph = await GetUrlsGraphCollection().deleteMany({});
  const result_delete_feast = await GetUrlsFeastCollection().deleteMany({});

  return { result_delete_graph, result_delete_feast };
};

const reset_crawlers = async () => {
  const result_delete_crawler = await GetCrawlersSessionCollection().deleteMany({});

  return result_delete_crawler;
};

module.exports = { reset, reset_crawlers };
