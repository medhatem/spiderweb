const { MongoClient } = require("mongodb");

const options = { useUnifiedTopology: true };
const client = new MongoClient(process.env.MONGODB_CONN_URL, options);
const databases = { crawlers: null };

const mongodbOpenConnexion = async () => {
  await client.connect();
  databases.crawlers = client.db("crawlers");
};

exports.GetUrlsCollection = () => {
  return databases.crawlers.collection("urls");
};

exports.MongoDbOpenConnexionFct = mongodbOpenConnexion;
