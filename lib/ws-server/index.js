import { Server as WebSocketServer } from 'ws';
import l from './../logger';

export default class WSServer {
  constructor (props) {
    var _this = this;
    const { port, regHosts, onMessage, server } = props;
    _this.port = port;
    _this.regHosts = regHosts;
    _this.wss = new WebSocketServer({ server });
    _this.onMessage = onMessage;
    _this.onConnection();
    l.log('WebSocketServer listening..');
  }

  onConnection () {
    var _this = this;
    _this.wss.on('connection', function connection(client) {
      if (_this.isRegistered(client)) {
        l.log('Ws-client connected. ', client.upgradeReq.connection.remoteAddress);
        client.on('message', _this.onMessage);
        client.on('close', () => {
          l.log(client.upgradeReq.connection.remoteAddress + ' disconnected.');
        });
      } else {
        l.log('Ws-client not registered. Closed. ', client.upgradeReq.connection.remoteAddress);
        client.close();
      }
    });
  }

  onDisconnect () {
    console.log('disconnected');
  }

  isRegistered (client) {
    var _this = this;
    var clientHost = client.upgradeReq.connection.remoteAddress;
    if (_this.regHosts.length > 0) {
      var regAddr = _this.regHosts.filter(function (addr) {
        return addr === clientHost || '::ffff:' + addr === clientHost;
      });
      return regAddr[0];
    } else {
      return true;
    }
  }

  broadcast (data) {
    var _this = this;
    const strData = JSON.stringify(data);
    _this.wss.clients.forEach(function each(client) {
      if (_this.isRegistered(client)) {
        client.send(strData, function (err) {
          if (err) {
            l.log('(client.send) err:', err.message);
          }
        });
      }
    });
  };
}
