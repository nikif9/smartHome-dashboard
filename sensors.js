// sensor.js

const SensorGroup = require('./sensorGroup');
class Sensors {
    constructor() {
        this.groups = new SensorGroup();
        this.sensors = [];
    }
    
    /**
     * добавляем сенсор в массив
     *
     * @param {string} id ид сенсора в виде sensors/0XBNA/enable' где 0XBNA название группы а enable название сенсора 
     * @param {string} value значение сенсора по которому мы узнаем тип сенсора
     */
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
    /**
     * обновляем данные сенсора в массиве
     *
     * @param {integer} index индекс сенсора в массиве
     * @param {string} value новое значение сенсора которое нужно вставить
     */
    updateSensorValueByIndex(index, sensorValue){
        console.log(this.groups.getAllGroup())
        var SensorIsCritical = this.isCritical(sensorValue)
        this.groups.updateGroup(this.sensors[index].group.toUpperCase(), SensorIsCritical, this.sensors[index].id)
        this.sensors[index].value = sensorValue
        this.sensors[index].SensorIsCritical = SensorIsCritical; 
    }    
    /**
     * изменить имя сенсора в массиве
     *
     * @param {string} sensorId ид сенсора 
     * @param {string} sensorName новое имя сенсора которое нужно вставить
     */
    changeSensorName(sensorId, sensorName){
        let sensor = this.sensors.find(sensor => sensor.id === sensorId);
        if (sensor) {
            sensor.name = sensorName;
            return true
        }else{
            return false
        }
    }
    /**
     * получеаем все сенсоры в массиве
     *
     * @return {array} senros массив внутри которого ассоциативный массив
     */
    getAllSensors(){
        return this.sensors;
    }
    /**
     * получеаем индекс сенсора в массиве
     * @param {string} sensorId ид масива по которому мы будем искать
     * @return {integer} index индекс массива
     */
    getSensorIndex(sensorId){
        return this.sensors.findIndex(sensor => sensor.id === sensorId);
    }
    /**
     * смотритм стали ли занчение сенсоров критическими 
     * @param {string} value значение сенсора в конце которого написано Lux, F, C или V если нет то возвращяем false
     * @return {bool} если true то значение сенсоа критическое 
     */
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
    /**
     * смотритм стали ли занчение сенсоров критическими 
     * @param {string} value значение сенсора в конце которого написано Lux, F, C, V или если что то другое то смотрим что
     * @return {object} ассоциативный массив виде name: тип сенсора, img:ссылка на изображение
     */
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
