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
    l.log('ws-client/index.connect() try to connect ' + _this.wsServerAddress);
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
    l.log('ws-client/index.onMessage ' + _this.wsServerAddress + ' message:', msg);
    _this.onMessage2(msg);
  }
  onOpen () {
    const _this = this;
    l.log('ws-client/index.onOpen ' + _this.wsServerAddress + ' connected.');
    _this.onChangeConnectionState(true);
  }
  onClose () {
    const _this = this;
    l.log('ws-client/index.onClose ' + _this.wsServerAddress + ' disconnected');
    _this.onChangeConnectionState(false);
    _this.reconnecting();
  }
  onError (err) {
    const _this = this;
    if (err.code !== 'ECONNREFUSED') {
      l.log('ws-client/index.onError not ECONNREFUSED ' + _this.wsServerAddress + ' error', err);
    } else {
      l.log('ws-client/index.onError ' + _this.wsServerAddress + ' error', err);
    }
    _this.onChangeConnectionState(false);
    _this.reconnecting();
  }
};
