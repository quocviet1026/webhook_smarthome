require('dotenv').config();
const os = require('os');
const app = require('./app');
// const oneHomeHandle = require('./src/api/v1/smarthome/oneHomeHandle/routes/oneHome.route');
const oneHomeHandle = require('./src/api/v2/smarthome/oneHomeHandle/routes/oneHome.route');
// console.log(os.cpus().length);
process.env.UV_THREADPOOL_SIZE = os.cpus().length;
const PORT = process.env.PORT || 3636;

app.listen(PORT, () => {
  console.log(`Server Listen at ${PORT}`);
});