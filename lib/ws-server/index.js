import { Server as WebSocketServer } from 'ws';
import l from './../logger';

export default class WSServer {
  constructor (props) {
    var _this = this;
    const { port, regHosts, onMessage, onConnect, server, path } = props;
    _this.port = port;
    _this.regHosts = regHosts;
    _this.connectionProps = { server, path: '/' + path };
    _this.wss = new WebSocketServer(_this.connectionProps);
    _this.onMessage = onMessage || _this.onMessage;
    _this.onConnect = onConnect;
    _this.onConnection();
    l.log('ws-server/index.constructor: WebSocketServer listening..');//, _this.connectionProps);
  }

  onConnection () {
    var _this = this;
    _this.wss.on('connection', function connection(client) {
      if (_this.isRegistered(client)) {
        l.log('ws-server/index _this.wss.on(`connection`) Ws-client connected: ', client.upgradeReq.connection.remoteAddress);
        _this.onConnect(client);
        client.on('message', _this.onMessage);
        client.on('close', () => {
          l.log('ws-server/index client.on(`close`) disconnected: ' + client.upgradeReq.connection.remoteAddress);
        });
      } else {
        l.log('ws-server/index Ws-client not registered. Closed. ', client.upgradeReq.connection.remoteAddress);
        client.close();
      }
    });
  }

  onDisconnect () {
    l.log('disconnected');
  }

  onMessage (msg) {
    l.log('ws-server/index onMessage: incomming message.. (parse) ', JSON.parse(msg));
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
    let strData = data;
    if (typeof data === 'object') {
      strData = JSON.stringify(data);
    }

    l.log('ws-server/index.broadcast data(stringify) ', strData);
    _this.wss.clients.forEach(function each(client) {
      if (_this.isRegistered(client)) {
        client.send(strData, function (err) {
          if (err) {
            l.log('ws-server/index (client.send) err:', err.message);
          }
        });
      }
    });
  };
}
