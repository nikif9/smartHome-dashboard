/** класс для работы с socket io 
 */
const ioClient = require('socket.io-client');

class SocketServer {
  constructor(server) {
    this.socket = ioClient.connect(server);
    this.initialize();
  }

  initialize() {
    this.socket.on('connect', () => {
        console.log('Подключено к серверу');
    });
  }

  sendMessage(handlerName, message) {
    this.socket.emit(handlerName, message);
  }
}

module.exports = SocketServer;
