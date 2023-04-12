const express = require('express');
const mqtt = require('mqtt');
const ejs = require('ejs');
const socketIo = require('socket.io');


// Импортирование классов Sensor и SensorGroup
const Sensors = require('./sensors');

var sensors = new Sensors();

const app = express()
const brokerUrl = 'mqtt://185.185.68.206:1883'
const client = mqtt.connect(brokerUrl)
app.use(express.static(__dirname + '/public'));

client.on('connect', function () {
    console.log('connected to broker');
    client.subscribe('#');
});
const server = app.listen(3000, () => {
    console.log('Server listening on port 3000')
})
const io = socketIo(server)

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/rename-sensor', (req, res) => {
    const sensorId = req.query.sensorId;
    const sensorName = req.query.name;
    const result = sensors.changeSensorName(sensorId, sensorName)
    if (result) {
        res.send('ой что то пошло нетак');
    }else{
        res.send('Название датчика обновлено!');
    }
});

client.on('message', (topic, message) => {
    const sensorIndex = sensors.getSensorIndex(topic)
    if (sensorIndex != -1) {
        sensors.updateSensorValueByIndex(sensorIndex, message.toString())
    }else{
        sensors.addSensor(topic, message.toString())
    }
    
    // console.log(sensors.getAllGroup())
    io.emit('sensors', sensors.getAllSensors())
})