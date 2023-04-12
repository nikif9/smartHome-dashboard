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
    
    addNewGroup(groupName, status, sensorId){
        var group = {name:groupName}
        if (status) {
            group['status'] = 'off'
            group['criticalSenors'] = [sensorId]
        }else{
            group['status'] = 'on'
            group['criticalSenors'] = []
        }
        this.groups.push(group)
    }

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
                this.disableGroup('off', groupName)
            }

        }else{
            const index = group['criticalSenors'].indexOf(sensorId)
            if (index != -1) {
                group['criticalSenors'].splice(index, 1)
            }
            if (group['criticalSenors'].length <= 0 && group['status'] == 'off') {
                group.status = 'on'
                this.disableGroup('on', groupName)
            }
        }
    }

    disableGroup(groupStatus, groupName){
        var data = {"group": groupName, value: groupStatus}
        const jsonString = JSON.stringify(data);
        console.log(jsonString)
        this.socket.emit('message', jsonString);
        
    }

    getGroup(groupName){
        return this.groups.find(group => group.name === groupName);
    }
    getAllGroup(){
        return this.groups;
    }


}

module.exports = SensorGroup;
