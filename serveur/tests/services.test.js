// DOTENV
const dotenv = require("dotenv");
// On prend le même que dev pour l'instant mais ca va changer
const result_dotenv = dotenv.config("../.env");
if (result_dotenv.error) {
  throw result_dotenv.error;
}
console.log(result_dotenv.parsed);

// REQUIRE
const { MongoDbOpenConnexion , mongodbCreateCollections, MongodbDeleteDatabase, MongoDbCloseConnexion } = require("../src/conn-databases/mongodb");
const { fetchAllUrlsGraph, fetchOneNodeUrlsGraph, feast, stock, init_stock } = require("../src/services/urls");
const { authentication, subscribe, deconnection, allTokensOfActiveCrawlers } = require("../src/services/crawlers-manager");

// TESTS
beforeAll(async () => {
  await MongoDbOpenConnexion("crawlers-test");
  await MongodbDeleteDatabase();
  await mongodbCreateCollections();
});

afterAll(async () => {
  await MongoDbCloseConnexion();
})

test('Test a full crawler management cycle', async () => {
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
})