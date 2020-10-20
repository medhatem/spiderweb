const { MongoClient } = require("mongodb");

const options = { useUnifiedTopology: true };
const client = new MongoClient(process.env.MONGODB_CONN_URL, options);
const databases = { crawlers: null };

const mongodbOpenConnexion = async () => {
  await client.connect();
  databases.crawlers = client.db("crawlers");
  // Create Index only if doesn't exists
  await databases.crawlers.collection("urls_graph").createIndex({ url_parent: 1 }, { unique: true });
  await databases.crawlers.collection("urls_feast").createIndex({ url: 1 }, { unique: true });
  await databases.crawlers.collection("crawlers_session").createIndex({ crawler_token: 1 }, { unique: true });
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

exports.MongoDbOpenConnexionFct = mongodbOpenConnexion;