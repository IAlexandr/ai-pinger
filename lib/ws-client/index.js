import WS from 'ws';
import l from './../logger';

export default class WSClient {
  constructor (props) {
    const _this = this;
    const { wsServerAddress, onMessage, onOpen, onClose, onError, onChangeConnectionState } = props;
    _this.wsServerAddress = wsServerAddress;
    _this.wsSocket = null;
    _this.onMessage2 = onMessage; //|| _this.onMessage;
    _this.onOpen = onOpen || _this.onOpen;
    _this.onClose = onClose || _this.onClose;
    _this.onError = onError || _this.onError;
    _this.onChangeConnectionState = onChangeConnectionState;
    _this.connect();
  }
  connect () {
    const _this = this;
    l.debug('ws-client/index.connect() try to connect ' + _this.wsServerAddress);
    try {
      _this.wsSocket = new WS(_this.wsServerAddress);
      _this.wsSocket.on('open', _this.onOpen.bind(_this));
      _this.wsSocket.on('close', _this.onClose.bind(_this));
      _this.wsSocket.on('error', _this.onError.bind(_this));
      _this.wsSocket.on('message', _this.onMessage.bind(_this));
    } catch (err) {
      l.debug(_this.wsServerAddress +  ' try catch err: ',err);
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
    l.debug('Ws-client received the message from: ' + _this.wsServerAddress + '. Message:', msg);
    _this.onMessage2(msg);
  }
  onOpen () {
    const _this = this;
    l.log('Ws-client connected to: ' + _this.wsServerAddress + '.');
    _this.onChangeConnectionState(true);
  }
  onClose () {
    const _this = this;
    l.log('Ws-client disconnected (' + _this.wsServerAddress + ').');
    _this.onChangeConnectionState(false);
    _this.reconnecting();
  }
  onError (err) {
    const _this = this;
    l.debug('Ws-client: ' + _this.wsServerAddress + '. Error: ', err.message);
    _this.onChangeConnectionState(false);
    _this.reconnecting();
  }
  send(msg) {
    this.wsSocket.send(JSON.stringify(msg));
  };
};
