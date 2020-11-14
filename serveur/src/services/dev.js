/**
 * Utils pour le developpement
 */
const { GetUrlsGraphCollection, GetUrlsFeastCollection } = require("../conn-databases/mongodb");

const reset = async () => {
  const result_delete_graph = await GetUrlsGraphCollection().deleteMany({});
  const result_delete_feast = await GetUrlsFeastCollection().deleteMany({});

  return { result_delete_graph, result_delete_feast };
};

module.exports = { reset };
