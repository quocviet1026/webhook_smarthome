const redis = require('redis');

const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
});

client.on('connect', () => {
  console.log('Redis Connected!');
});

client.on('error', (error) => {
  console.error(error);
});

client.on('ready', () => {
  console.log('Redis ready!');
});

client.connect();

module.exports = client;
