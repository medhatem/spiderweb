// DOTENV
const dotenv = require("dotenv");
// On prend le même que dev pour l'instant mais ca va changer
const result_dotenv = dotenv.config("../.env");
if (result_dotenv.error) {
  throw result_dotenv.error;
}
console.log(result_dotenv.parsed);

// REQUIRE
const { MongoDbOpenConnexion , mongodbCreateCollections, MongodbDeleteDatabase, MongoDbCloseConnexion, ...coll } = require("../src/conn-databases/mongodb");
const { fetchAllUrlsGraph, fetchOneNodeUrlsGraph, feast, stock, init_stock } = require("../src/services/urls");
const { authentication, subscribe, deconnection, allTokensOfActiveCrawlers } = require("../src/services/crawlers-manager");

// TESTS
beforeAll(async () => {
  await MongoDbOpenConnexion("crawlers-test");
  await MongodbDeleteDatabase();
  await mongodbCreateCollections();
});

beforeEach(async () => {
  await coll.GetUrlsGraphCollection().deleteMany({});
  await coll.GetUrlsFeastCollection().deleteMany({});
  await coll.GetCrawlersSessionCollection().deleteMany({});
})

afterAll(async () => {
  await MongoDbCloseConnexion();
})

const test_timeout_ms = 10000;



test('Full crawler management cycle', async () => {
  // Subscribe
  const crawler_token = await subscribe(process.env.CRAWLER_TOKEN_SECRET);
  expect(crawler_token).toBeTruthy();
  // Auth
  const crawler_session = await authentication(crawler_token);
  expect(crawler_session).toBeTruthy();
  expect(crawler_session.crawler_token).toBe(crawler_token);
  // Get all active token
  const token_array = await allTokensOfActiveCrawlers();
  expect(token_array.length).toBe(1);
  expect(token_array[0].crawler_token).toBe(crawler_token);
  // Deconnection
  const result = await deconnection(crawler_token);
  expect(result).toBeTruthy();
  // Get all active token again
  const token_array_2 = await allTokensOfActiveCrawlers();
  expect(token_array_2.length).toBe(0);
}, test_timeout_ms)

test('Crawler last auth expire', async () => {
  // Subscribe
  const crawler_token = await subscribe(process.env.CRAWLER_TOKEN_SECRET);
  expect(crawler_token).toBeTruthy();
  // Auth
  const crawler_session = await authentication(crawler_token);
  expect(crawler_session).toBeTruthy();
  expect(crawler_session.crawler_token).toBe(crawler_token);
  // Get all active token
  const token_array = await allTokensOfActiveCrawlers();
  expect(token_array.length).toBe(1);
  expect(token_array[0].crawler_token).toBe(crawler_token);
  // Last_auth 1 hour in past
  const update_result = await coll.GetCrawlersSessionCollection().updateOne(
    { crawler_token: { $eq: crawler_token } },
    { $set: { last_auth: new Date(new Date() - (3600 * 1000)) } } // 1 hour in past
  );
  expect(update_result).toBeTruthy();
  // Get all active token again
  const token_array_2 = await allTokensOfActiveCrawlers();
  expect(token_array_2.length).toBe(0);
}, test_timeout_ms)




test('client init feast', async () => {
  // Subscribe
  const crawler_token = await subscribe(process.env.CRAWLER_TOKEN_SECRET);
  expect(crawler_token).toBeTruthy();
  // Auth
  const crawler_session = await authentication(crawler_token);
  expect(crawler_session).toBeTruthy();
  expect(crawler_session.crawler_token).toBe(crawler_token);
  // Get all active token
  const token_array = await allTokensOfActiveCrawlers();
  expect(token_array.length).toBe(1);
  expect(token_array[0].crawler_token).toBe(crawler_token);

  const init_stock_result_1 = await init_stock(["https://facebook.com", "https://usherbrooke.ca", "https://en.wikipedia.org", "https://expressjs.com"]);
  expect(init_stock_result_1.insertedCount).toBe(4);
  const init_stock_result_2 = await init_stock(["https://facebook.com", "https://usherbrooke.ca", "https://en.wikipedia.org", "https://expressjs.com"]);
  expect(init_stock_result_2).toBeFalsy();
  const init_stock_result_3 = await init_stock(["https://facebook.com", "https://docs.mongodb.com", "https://medium.com",  "https://www.geeksforgeeks.org", "https://learning.postman.com"]);
  expect(init_stock_result_3.insertedCount).toBe(4);
}, test_timeout_ms)




test('client stock url two time with sames and differents url', async () => {
  // Subscribe
  const crawler_token = await subscribe(process.env.CRAWLER_TOKEN_SECRET);
  expect(crawler_token).toBeTruthy();
  // Auth
  const crawler_session = await authentication(crawler_token);
  expect(crawler_session).toBeTruthy();
  expect(crawler_session.crawler_token).toBe(crawler_token);
  // Get all active token
  const token_array = await allTokensOfActiveCrawlers();
  expect(token_array.length).toBe(1);
  expect(token_array[0].crawler_token).toBe(crawler_token);

  const stock_result_1 = await stock(crawler_session, [
    {
        "lien_principal": "github.com", 
        "set_enfant":[
            "https://facebook.com",
            "https://usherbrooke.ca"
        ]
    },
    {
        "lien_principal": "facebook.com", 
        "set_enfant":[
            "https://youtube.com",
            "https://developer.mozilla.org",
            "https://stackoverflow.com"
        ]
    },
    {
        "lien_principal": "https://usherbrooke.ca",
        "set_enfant": [
            "https://en.wikipedia.org",
            "https://docs.mongodb.com",
            "https://expressjs.com"
        ]
    },
    {
        "lien_principal": "https://expressjs.com",
        "set_enfant": [
            "https://www.w3schools.com",
            "https://medium.com"
        ]
    },
    {
        "lien_principal": "https://medium.com",
        "set_enfant": [
            "https://www.geeksforgeeks.org",
            "https://learning.postman.com"
        ]
    },
    {
        "lien_principal":"https://www.geeksforgeeks.org",
        "set_enfant": [
            "https://en.wikipedia.org", 
            "https://facebook.com"
        ]
    }
  ]);
  expect(stock_result_1).toBeTruthy();

  const feast_result = await feast(crawler_session, 50);
  expect(feast_result.length).toBe(12);
}, test_timeout_ms)

