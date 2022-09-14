const redisDb = require('../database/redisDb');

module.exports = {
  setKey: (key, value) =>
    new Promise((resolve, reject) => {
      redisDb
        .set(key, value)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    }),

  delKey: (key) =>
    new Promise((resolve, reject) => {
      redisDb
        .del(key)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    }),

  getKey: (key) =>
    new Promise((resolve, reject) => {
      redisDb
        .get(key)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    }),
};
