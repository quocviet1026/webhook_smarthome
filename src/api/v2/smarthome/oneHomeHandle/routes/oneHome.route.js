require('dotenv').config();
const mqtt = require('mqtt');
const MQTTEmitter = require('mqtt-emitter');
const {
  register,
  control,
  updateData,
} = require('../controllers/oneHome.controller');

console.log(
  `-----------MQTT, ${process.env.MQTT_PORT}, ${process.env.MQTT_ADDRESS}`
);

const options = {
  port: process.env.MQTT_PORT,
  host: process.env.MQTT_ADDRESS,
};

// eslint-disable-next-line prettier/prettier
const topicListenOnehomeGateway = process.env.MQTT_TOPIC_LISTEN_ONEHOME_GATEWAY;

const events = new MQTTEmitter();
const mqttClient = mqtt.connect(options);

mqttClient.on('connect', () => {
  console.log('----> MQTT Connect SUCCESS');
  mqttClient.subscribe(topicListenOnehomeGateway, { qos: 0 }, (err) => {
    if (!err) {
      //   console.log();
    } else {
      // eslint-disable-next-line prettier/prettier
      console.log(`\n\n-------->>> oneHome Route subscribe to topicListenOnehomeGateway error: ${err}`);
    }
  });
});

mqttClient.on('error', (err) => {
  console.log(`oneHome Route connect error: ${err}`);
});

mqttClient.on('message', (topic, message) => {
  console.log('oneHome Route MQTT on message');
  console.log(`--->>> Received (topic): ${topic}`);
  console.log(`--->>> Received (message): ${message}`);

  try {
    /* Convert messeage from Json to Object */
    const messageParsed = JSON.parse(message);
    /* Trigger event */
    events.emit(topic, messageParsed);
  } catch (e) {
    console.log(`--->>>neHome Route MQTT message error: ${e}`);
  }
});

/**
 * Message from Gateway to Cloud:
 * ---Register:
 *  addDevice
 * {
 *  "typeMessage" : "register",
 *  "dataMessage" : {
 *      "properties" : {
 *          "command" : "addDevice"
 *          "data"   : {
 *              "deviceEUI" : "",
 *              "deviceId" : "",
 *              "child" : [1,2,3],
 *              "deviceType" : "",
 *              "connectivityType" : "",
 *              "deviceName" : "",
 *              "gatewayId" : "",
 *              "userId" : ""
 *          }
 *      }
 * }
 *
 *  removeDevice
 * {
 *  "typeMessage" : "register",
 *  "dataMessage" : {
 *      "properties" : {
 *          "command" : "removeDevice"
 *          "data"   : {
 *              "deviceEUI" : ""
 *          }
 *      }
 * }
 *
 * updateData:
 *  {
 *  "typeMessage" : "updateData,
 *  "dataMessage" : {
 *      "properties" : {
 *          "command" : "updateStrait",
 *          "data"   : {
 *              "deviceEUI" : "",
 *              "trait" : "",
 *              "child" : 1,
 *              "value" : "",
 *              "timeStamp" : 121234123s
 *          }
 *      }
 * }
 */
events.on(topicListenOnehomeGateway, (messageParsed) => {
  console.log('\n\n--------->>> MQTT oneHome messageParsed: ', messageParsed);
  const { typeMessage } = messageParsed;
  switch (typeMessage) {
    case 'register':
      register(messageParsed);
      break;
    case 'control':
      control(messageParsed);
      break;
    case 'updateData':
      updateData(messageParsed);
      break;
    default:
      console.log(`ERROR, not support typeMessage: ${typeMessage}`);
  }
});

module.exports = mqttClient;
