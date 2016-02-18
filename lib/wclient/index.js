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
    this.wsSocket = new ws('ws://localhost:8080/server');//this.wsParentServerAddress);
    this.wsSocket.on('open', function open() {
      console.log('connected.');
    });
    this.wsSocket.on('close', function close() {
      console.log('disconnected');
    });
    this.wsSocket.on('error', function err(err) {
      console.log('error', err);
    });
    this.wsSocket.on('message', function incoming(msg) {
      console.log('message:', msg);
    });
  }
};
