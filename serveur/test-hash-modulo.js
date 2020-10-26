const crypto = require("crypto");

const data = [
  "https://facebook.com",
  "https://usherbrooke.ca",
  "https://en.wikipedia.org",
  "https://docs.mongodb.com",
  "https://expressjs.com",
  "https://www.w3schools.com",
  "https://medium.com",
  "https://youtube.com",
  "https://developer.mozilla.org",
  "https://stackoverflow.com",
  "https://www.geeksforgeeks.org",
  "https://learning.postman.com",
];

const urlToNumber = (url) => {
  hash = crypto.createHash("sha1");
  hash.update(url);
  const url_hashed = hash.digest("hex");
  console.log("url_hashed: ", url_hashed);
  const url_hashed_slice = url_hashed.slice(url_hashed.length - 13); // Long = int64 = 8bytes = 16 caracteres hexa
  console.log("url_hashed_slice: ", url_hashed_slice);
  return Number(`0x${url_hashed_slice}`);
};

const remainder_op = (url) => ({ url, rem: urlToNumber(url) % 4 });

const group = (acc, cur) => {
  if (!acc[cur.rem]) {
    acc[cur.rem] = [];
  }
  acc[cur.rem].push(cur);
  return acc;
};

const test = () => {
  console.log(data.map((url) => urlToNumber(url)));
  console.log(data.map(remainder_op).reduce(group, {}));
};

test();
