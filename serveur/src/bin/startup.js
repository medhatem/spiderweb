const { MongoDbOpenConnexion, MongodbCreateCollections } = require("../conn-databases/mongodb");

async function startup() {
  await MongoDbOpenConnexion();
  await MongodbCreateCollections();
}

module.exports = startup;
