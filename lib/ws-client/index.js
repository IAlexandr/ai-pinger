import WS from 'ws';
import l from './../logger';
/*
function prepNetworkHost (server, networkKey) {
  if (!server.network[networkKey]) {
    throw new Error('Указанная сеть ' + networkKey + ' не зарегистрирована на сервере.');
  }
  if (server.network[networkKey].hasOwnProperty('dnsName') || server.network[networkKey].hasOwnProperty('ip')) {
    return server.network[networkKey].dnsName || server.network[networkKey].ip;
  } else {
    throw new Error('Неполная информация о сети ' + networkKey + '.');
  }
}

function prepParentServerAddress (config) {
  parentPingers = [];
  Object.keys(config.pinger).forEach((pingerInfo) => {
    if (pingerInfo.parent) {
      parentPingers.push(pingerInfo);
    }
  });
  if (parentPingers.length > 1) {
    l.log('creating WebSocketServer..');
    // TODO поддержку нескольких родителей (пингеров)
    
  }
  const server = config.server[info.parent.serverName];
  if (!server) {
    throw new Error('Указанный сервер ' + info.serverName + ' не найден.');
  }

  return 'ws://' + prepNetworkHost(server, info.parent.network) + ':' + info.parent.wsPort;
}*/

export default class WSClient {
  constructor (props) {
    const _this = this;
    const { wsServerAddress, onMessage } = props;
    _this.wsServerAddress = wsServerAddress;
    _this.wsSocket = null;
    _this.onMessage = onMessage;
    _this.connect();
  }
  connect () {
    const _this = this;
    l.log('try to connect ' + _this.wsServerAddress);
    let wsSocket = null;
    try {
      _this.wsSocket = new WS(_this.wsServerAddress);
      _this.wsSocket.on('open', function open() {
        l.log(_this.wsServerAddress + ' connected.');
        _this.wsSocket.send('hello from wclient :D');
      });
      _this.wsSocket.on('close', function close() {
        l.log(_this.wsServerAddress + ' disconnected');
        _this.reconnecting();
      });
      _this.wsSocket.on('error', function err(err) {
        if (err.code !== 'ECONNREFUSED') {
          l.log(_this.wsServerAddress + ' error', err);
        }
        _this.reconnecting();
      });
      _this.wsSocket.on('message', function incoming(msg) {
        l.log('message:', msg);
      });
    } catch (err) {
      console.error(_this.wsServerAddress +  ' try catch err: ',err);
      _this.reconnecting();
    }
  }

  reconnecting () {
    var _this = this;
    setTimeout(function () {
      _this.connect();
    }, 1000);
  }
};
