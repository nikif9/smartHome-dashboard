// sensor.js

const SensorGroup = require('./sensorGroup');
class Sensors {
    constructor() {
        this.groups = new SensorGroup();
        this.sensors = [];
    }
    

    addSensor(id, value) {
        const sensorType = this.getSensorType(value)
        const SensorIsCritical = this.isCritical(value)
        const groupName = id.split('/')[1]
        if (this.groups.getGroup(groupName)) {
            this.groups.updateGroup(groupName, SensorIsCritical,id)
        }else{
            this.groups.addNewGroup(groupName, SensorIsCritical,id)
        }
        this.sensors.push({
            id:id, 
            name:id.split('/').pop(), 
            value: value, 
            group: groupName.toLowerCase(), 
            sensorType:sensorType, 
            SensorIsCritical: SensorIsCritical,
            selector:id.replace(/\//g, '-')
        })
    }

    updateSensorValueByIndex(index, sensorValue){
        console.log(this.groups.getAllGroup())
        var SensorIsCritical = this.isCritical(sensorValue)
        this.groups.updateGroup(this.sensors[index].group.toUpperCase(), SensorIsCritical, this.sensors[index].id)
        this.sensors[index].value = sensorValue
        this.sensors[index].SensorIsCritical = SensorIsCritical;
            
           
    }    

    changeSensorName(sensorId, sensorName){
        let sensor = this.sensors.find(sensor => sensor.id === sensorId);
        if (sensor) {
            sensor.name = sensorName;
            return true
        }else{
            return false
        }
    }
    
    getAllSensors(){
        return this.sensors;
    }

    getSensorIndex(sensorId){
        return this.sensors.findIndex(sensor => sensor.id === sensorId);
    }

    isCritical(value){
        var intValue = parseInt(value)
        if (isNaN(intValue)) {
            return false;
        }
        
        if (value.endsWith('Lux') && intValue > 800) {
            return true
        }else if ((value.endsWith('F') && (intValue-32)*5/9 > 50) || (value.endsWith('C') && intValue > 50)) {
            return true
        } else if (value.endsWith('V') & intValue < 170) {
            return true
        }
        return false
    }

    getSensorType(value) {
        // console.log(value)
        if (isNaN(parseInt(value))) {
            if (value == 'off' || value == 'on') {
                return {name:'switch', img:'img/power button.svg'}
            }else if (value == 'closed' || value == 'open') {
                return {name:'door', img:'img/door handle.svg'}
            }else{
                return {name:'undefined', img:'img/plug.svg'}
            }
        }else{
            if (value.endsWith('Lux')) {
                return {name:'lamp', img:'img/bulb.svg'}
            }else if (value.endsWith('F') || value.endsWith('C')) {
                return {name:'Temperature', img:'img/thermostat.svg'}
            } else if (value.endsWith('V')) {
                return {name:'socket', img:'img/socket f.svg'}
            }else{
                return {name:'undefined', img:'img/plug.svg'}
            }
        }
    }
}

module.exports = Sensors;
