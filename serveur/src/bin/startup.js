const MongoDbOpen = require("../conn-databases/mongodb")
  .MongoDbOpenConnexionFct;

async function startup() {
  await MongoDbOpen();
}

module.exports = startup;
