/*
 * Setup environnements variables (check 12 factor app manifesto for more info)
 */
const dotenv = require("dotenv");
const result_dotenv = dotenv.config("../../.env");
if (result_dotenv.error) {
  throw result_dotenv.error;
}
console.log(result_dotenv.parsed);

const MongoDbOpen = require("../conn-databases/mongodb").MongoDbOpenConnexionFct;

async function startup() {
  await MongoDbOpen();
}

module.exports = startup;
