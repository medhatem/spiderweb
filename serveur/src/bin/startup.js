const { MongoDbOpenConnexion , MongodbCreateDatabase } = require("../conn-databases/mongodb");

async function startup() {
  await MongoDbOpenConnexion();
  await MongodbCreateDatabase();
}

module.exports = startup;
