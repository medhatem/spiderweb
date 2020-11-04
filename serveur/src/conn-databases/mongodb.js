const { MongoClient } = require("mongodb");

const options = { useUnifiedTopology: true };
const databases = { crawlers: null };
const clients = { mongo_client: null };

const create_client_once = () => {
  if (clients.mongo_client) {
    return;
  }

  clients.mongo_client = new MongoClient(process.env.MONGODB_CONN_URL, options);
};

const mongodbOpenConnexion = async (db_name) => {
  create_client_once();
  const client = clients.mongo_client;
  await client.connect();
  databases.crawlers = client.db(db_name || "crawlers");
};

const mongoDbCloseConnexion = async () => {
  if (!clients.mongo_client.isConnected()) {
    console.error("Crawler database connexion not initialize");
    return;
  }

  await clients.mongo_client.close();
};

const mongodbCreateCollections = async () => {
  if (!clients.mongo_client.isConnected()) {
    console.error("Crawler database connexion not initialize");
    return;
  }

  if (!databases.crawlers) {
    console.error(" no crawlers database exist");
    return;
  }

  // Create Index only if doesn't exists
  await databases.crawlers.collection("urls_graph").createIndex({ url_parent: 1 }, { unique: true });
  await databases.crawlers.collection("urls_feast").createIndex({ url: 1 }, { unique: true });
  await databases.crawlers.collection("crawlers_session").createIndex({ crawler_token: 1 }, { unique: true });
  // On va conserver l'id pour les sessions de crawler pour que prochainement on puisse changer le token
};

const mongodbDeleteDatabase = async () => {
  if (!clients.mongo_client.isConnected()) {
    console.error("Crawler database connexion not initialize");
    return;
  }

  if (!databases.crawlers) {
    console.error(" no crawlers database exist");
    return;
  }

  await databases.crawlers.dropDatabase();
};

exports.GetUrlsGraphCollection = () => {
  return databases.crawlers.collection("urls_graph");
};

exports.GetUrlsFeastCollection = () => {
  return databases.crawlers.collection("urls_feast");
};

exports.GetCrawlersSessionCollection = () => {
  return databases.crawlers.collection("crawlers_session");
};

exports.MongoDbOpenConnexion = mongodbOpenConnexion;
exports.MongodbCreateCollections = mongodbCreateCollections;
exports.MongodbDeleteDatabase = mongodbDeleteDatabase;
exports.MongoDbCloseConnexion = mongoDbCloseConnexion;
