require('dotenv').config();

const mongoose = require('mongoose');

const mongo = mongoose.createConnection(process.env.MONG_URI);

mongo.on('connected', function () {
  console.log(`MongoDB::: mongoected - ${this.name}`);
});

mongo.on('disconnected', function () {
  console.log(`MongoDB::: dismongoect - ${this.name}`);
});

mongo.on('error', (error) => {
  console.log(`MongoDB::: error - ${JSON.stringify(error)}`);
});

process.on('SIGINT', async () => {
  await mongo.close();
  process.exit(0);
});

module.exports = mongo;
