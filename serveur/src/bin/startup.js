const { MongoDbOpenConnexion, MongodbCreateCollections } = require("../conn-databases/mongodb");

async function startup() {
  await MongoDbOpenConnexion(process.env.CRAWLER_DB_NAME);
  await MongodbCreateCollections();
}

module.exports = startup;
