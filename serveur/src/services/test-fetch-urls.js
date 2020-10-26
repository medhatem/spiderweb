const GetUrlsFeastCollection = require("../conn-databases/mongodb").GetUrlsFeastCollection;

const populateTest = async () => {
  const docCount = await GetUrlsFeastCollection().countDocuments();
  if (docCount > 0) {
    return;
  }

  await GetUrlsFeastCollection().bulkWrite([
    { insertOne: { document: { url: "https://github.com/" } } },
    { insertOne: { document: { url: "https://facebook.com/" } } },
    { insertOne: { document: { url: "https://usherbrooke.ca/" } } },
    { insertOne: { document: { url: "https://youtube.com/" } } },
    { insertOne: { document: { url: "https://www.mongodb.com/" } } },
  ]);
};

const fetchTest = async () => {
  await populateTest();

  const getAllDocs = await GetUrlsFeastCollection().find().toArray();
  return getAllDocs;
};

exports.FetchTest = fetchTest;
