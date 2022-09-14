const redisDb = require('../database/redisDb');

// Increment to value of key
const incr = (key) =>
  new Promise((resolve, reject) => {
    redisDb
      .incr(key)
      .then((result) => {
        console.log('incr: ', result);
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });

// Set expire time to value of key
const expire = (key, timeSet) =>
  new Promise((resolve, reject) => {
    redisDb
      .expire(key, timeSet)
      .then((result) => {
        console.log('expire: ', result);
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });

// Return time to live of key
const ttl = (key) =>
  new Promise((resolve, reject) => {
    redisDb
      .ttl(key)
      .then((result) => {
        console.log(`ttl of ${key} is ${result}`);
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });

module.exports = {
  incr,
  expire,
  ttl,
};
