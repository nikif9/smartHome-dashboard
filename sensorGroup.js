/** 
 * класс для контроля на группой сенсоров если хоть у одного сенcора выходит критическое значение то отпрвавляем сообщение по socket io 
 * о том что нужно выключить группу а если все сенсоры стабильны то включаем группу обратон
*/
const ioClient = require('socket.io-client');
class SensorGroup {
    constructor() {
        this.groups = [];

        this.socket = ioClient.connect('http://185.185.68.206:3000');
        // console.log(this.socket)
        this.socket.on('connect', () => {
            console.log('Подключено к серверу');
            // Здесь можно выполнить дополнительные действия, связанные с подключением
            this.socket.emit('message', 'asd');
        });
    }
    /**
     * добавляем группу в массив
     *
     * @param {string} groupName назавние группы
     * @param {bool} status критическое ли значение у этого сенсора
     * @param {string} sensorId, ид сенсора нужно так как если оно критоично то записываем его 
     */
    addNewGroup(groupName, status, sensorId){
        var group = {name:groupName}
        if (status) {
            group['status'] = 'off'
            group['criticalSenors'] = [sensorId]
            this.toggleGroup('off', groupName)
        }else{
            group['status'] = 'on'
            group['criticalSenors'] = []
        }
        this.groups.push(group)
    }
    /**
     * изменяем статус группы в массиве
     *
     * @param {string} groupName назавние группы
     * @param {bool} status критическое ли значение у этого сенсора
     * @param {string} sensorId, ид сенсора нужно так как если оно критоично то записываем его 
     */
    updateGroup(groupName, status, sensorId){
        var groupStatus
        var group = this.groups.find(group => group.name === groupName);
        if (status) {
            groupStatus = 'off'
            if (!group['criticalSenors'].includes(sensorId)) {
                group['criticalSenors'].push(sensorId)
            }
            if (group['status'] == 'on') {
                group.status = 'off'
                this.toggleGroup('off', groupName)
            }

        }else{
            const index = group['criticalSenors'].indexOf(sensorId)
            if (index != -1) {
                group['criticalSenors'].splice(index, 1)
            }
            if (group['criticalSenors'].length <= 0 && group['status'] == 'off') {
                group.status = 'on'
                this.toggleGroup('on', groupName)
            }
        }
    }
    /**
     * отправляем сообщении о включении или отключении группы по socket io по адресу http://185.185.68.206:3000
     *
     * @param {string} groupStatus значении off или on которое отправится
     * @param {string} groupName назавние группы
     */
    toggleGroup(groupStatus, groupName){
        var data = {"group": groupName, value: groupStatus}
        const jsonString = JSON.stringify(data);
        console.log(jsonString)
        this.socket.emit('message', jsonString);
    }
    /**
     * получаем группу из массива
     *
     * @param {string} groupName назавние группы которе ишьем 
     * @return {object} group ассоциативный массив с данными name: это название группы status: on или off  criticalSenors: массив с ид критических сенсоров
     */
    getGroup(groupName){
        return this.groups.find(group => group.name === groupName);
    }
     /** 
     * @return {object} group ассоциативный массив с данными name: это название группы status: on или off  criticalSenors: массив с ид критических сенсоров
     */
    getAllGroup(){
        return this.groups;
    }


}

module.exports = SensorGroup;
