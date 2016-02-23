import WSClient from './../ws-client';
import l from './../logger';

export default class NotificationServiceClient {
  constructor (props) {
    const _this = this;
    const { host, port, path, typeServices } = props;
    _this.host = host;
    _this.port = port;
    _this.path = path;
    _this.typeSevices = typeServices;
    _this.connected = false;
    _this.init();
  }

  send(msg) {
    l.debug('NSClient sending message:', msg);
    const _this = this;
    if (_this.connected) {
      _this.wsClient.send({
        message: msg,
        type: _this.typeSevices
      }, (err) => {
        l.debug('nsclient.send err:',err);
      });
    } else{
      l.debug(new Error('NS wsSocket not connected.'));
    }
  }

  init () {
    const _this = this;
    _this.wsServerAddress = 'ws://' + _this.host + ':' + _this.port + '/' + _this.path;
    _this.wsClient = new WSClient({
      wsServerAddress: _this.wsServerAddress,
      onMessage: _this.onMessage.bind(_this),
      onChangeConnectionState: _this.onChangeConnectionState.bind(_this)
    });
    l.debug('NotificationServiceClient initialized.');
  }

  onMessage (msg) {
    l.log('nsclient incoming message:', msg);
  }

  onChangeConnectionState (newConnectionState) {
    const _this = this;
    if (_this.connected !== newConnectionState) {
      _this.connected = newConnectionState;
    }
  }
};
