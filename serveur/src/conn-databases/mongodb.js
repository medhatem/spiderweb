const { MongoClient } = require('mongodb');

const options = {};
const client = new MongoClient(process.env.MONGODB_CONN_URL, options);


async function mongodbSetup() {
    /* await client.connect();
    const */ 
}

module.exports = mongodbSetup;