const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
// const errorHandle = require('./src/api/v1/middlewares/errorHandle');
const errorHandle = require('./src/api/v2/middlewares/errorHandle');

const app = express();

// app.use(helmet());
// app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res, next) => {
//     res.send('HOME PAGE');
// })

app.use('/v1', require('./src/api/v1/routes/routes'));

// app.use('/v2', require('./src/api/v2/routes/routes'));

app.use(errorHandle);

module.exports = app;
