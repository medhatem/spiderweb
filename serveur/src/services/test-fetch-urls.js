const GetUrlsCollection = require("../conn-databases/mongodb").GetUrlsCollection;

const populateTest = async () => {
  const docCount = await GetUrlsCollection().countDocuments();
  if (docCount > 0) {
    return;
  }

  await GetUrlsCollection().bulkWrite([
    { insertOne: { document: { url: "https://github.com/" } } },
    { insertOne: { document: { url: "https://facebook.com/" } } },
    { insertOne: { document: { url: "https://usherbrooke.ca/" } } },
    { insertOne: { document: { url: "https://youtube.com/" } } },
    { insertOne: { document: { url: "https://www.mongodb.com/" } } },
  ]);
};

const fetchTest = async () => {
  await populateTest();

  const getAllDocs = await GetUrlsCollection().find().toArray();
  return getAllDocs;
};

exports.FetchTest = fetchTest;
