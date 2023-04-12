const express = require('express');
const mqtt = require('mqtt');
const ejs = require('ejs');
const socketIo = require('socket.io');


// Импортирование классов Sensor
const Sensors = require('./sensors');

var sensors = new Sensors();

const app = express()
const brokerUrl = 'mqtt://185.185.68.206:1883'
const client = mqtt.connect(brokerUrl)
app.use(express.static(__dirname + '/public'));

// подключение к mqtt брокеру и подисаться на все топики
client.on('connect', function () {
    console.log('connected to broker');
    client.subscribe('#');
});
const server = app.listen(3000, () => {
    console.log('Server listening on port 3000')
})
const io = socketIo(server)

app.set('view engine', 'ejs')
// наш сайт
app.get('/', (req, res) => {
    res.render('index')
})

// страничка для изменения названия сенсора отправляем sensorId и name где sensorId это ид сенсора который является токеном 
// а name новое название сенсора
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
// получаем сообщение от топиков и создаем или обновляем информацию о сенсорах
client.on('message', (topic, message) => {
    const sensorIndex = sensors.getSensorIndex(topic)
    if (sensorIndex != -1) {
        sensors.updateSensorValueByIndex(sensorIndex, message.toString())
    }else{
        sensors.addSensor(topic, message.toString())
    }
    
    console.log(sensors.getAllSensors())
    io.emit('sensors', sensors.getAllSensors())
})