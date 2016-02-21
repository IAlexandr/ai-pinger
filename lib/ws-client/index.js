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
    const { wsServerAddress, onMessage, onOpen, onClose, onError, onChangeConnectionState } = props;
    _this.wsServerAddress = wsServerAddress;
    _this.wsSocket = null;
    _this.onMessage = onMessage || _this.onMessage;
    _this.onOpen = onOpen || _this.onOpen;
    _this.onClose = onClose || _this.onClose;
    _this.onError = onError || _this.onError;
    _this.onChangeConnectionState = onChangeConnectionState;
    _this.connect();
  }
  connect () {
    const _this = this;
    l.log('try to connect ' + _this.wsServerAddress);
    try {
      _this.wsSocket = new WS(_this.wsServerAddress);
      _this.wsSocket.on('open', _this.onOpen.bind(_this));
      _this.wsSocket.on('close', _this.onClose.bind(_this));
      _this.wsSocket.on('error', _this.onError.bind(_this));
      _this.wsSocket.on('message', _this.onMessage.bind(_this));
    } catch (err) {
      console.error(_this.wsServerAddress +  ' try catch err: ',err);
      _this.reconnecting();
    }
  }

  reconnecting () {
    var _this = this;
    setTimeout(function () {
      _this.connect();
    }, 5000);
  }

  onMessage (msg) {
    const _this = this;
    l.log(_this.wsServerAddress + ' message:', msg);
  }
  onOpen () {
    const _this = this;
    l.log(_this.wsServerAddress + ' connected.');
    _this.onChangeConnectionState(true);
  }
  onClose () {
    const _this = this;
    l.log(_this.wsServerAddress + ' disconnected');
    _this.onChangeConnectionState(false);
    _this.reconnecting();
  }
  onError (err) {
    const _this = this;
    if (err.code !== 'ECONNREFUSED') {
      l.log(_this.wsServerAddress + ' error', err);
    }
    _this.onChangeConnectionState(false);
    _this.reconnecting();
  }
};
