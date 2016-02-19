var ws = require('ws');
var config = require('./../../config');

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
  var info = config.about;
  var server = config.server[info.parent.serverName];
  if (!server) {
    throw new Error('Указанный сервер ' + info.serverName + ' не найден.');
  }

  return 'ws://' + prepNetworkHost(server, info.parent.network) + ':' + info.parent.wsPort;
}

module.exports = {
  wsParentServerAddress: prepParentServerAddress(config),
  wsSocket: null,
  connect: function () {
    console.log('try to connect ws.');
    var _this = this;
    var wsSocket = null;
    try {
      _this.wsSocket = new ws('ws://localhost:4445');
      _this.wsSocket.on('open', function open() {
        console.log('connected.');
        _this.wsSocket.send('hello from wclient :D');
      });
      _this.wsSocket.on('close', function close() {
        console.log('disconnected');
        _this.reconnecting();
      });
      _this.wsSocket.on('error', function err(err) {
        if (err.code !== 'ECONNREFUSED') {
          console.log('error', err);
        }
        _this.reconnecting();
      });
      _this.wsSocket.on('message', function incoming(msg) {
        console.log('message:', msg);
      });
    } catch (err) {
      console.error('ai: ',err);
      _this.reconnecting();
    }

    //_this.wsSocket = new ws('ws://localhost:4445');//this.wsParentServerAddress);

  },
  reconnecting: function () {
    var _this = this;
    setTimeout(function () {
      _this.connect();
    }, 1000);
  }
};
