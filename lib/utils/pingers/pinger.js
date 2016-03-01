import WS from 'ws';
import l from './../../logger';
import WSClient from './../../ws-client';

export default class Pinger {
  constructor (props) {
    const _this = this;
    const { pingerName, wsServerAddresses, onChangeState } = props;
    _this.pingerName = pingerName;

    _this.wsServerAddresses = wsServerAddresses.map((wsServerAddress) => {
      return wsServerAddress + '/' + pingerName;
    });
    _this.onChangeState = onChangeState || _this.onChangeState;
    _this.state = {
      connected: false,
      info: {}
    };
    _this.wsSocket = new WSClient({
      wsServerAddresses: _this.wsServerAddresses,
      onMessage: _this.onMessage.bind(_this),
      onChangeConnectionState: _this.onChangeConnectionState.bind(_this)
    });
  }

  onMessage (msg) {
    const _this = this;
    l.debug('pinger ' + _this.wsServerAddress + ' incoming message: ', msg);
    _this.state.info = JSON.parse(msg);
    _this.onChangeState(_this.pingerName, _this.state);
  }

  onChangeConnectionState (newConnectionState) {
    const _this = this;
    if (_this.state.connected !== newConnectionState) {
      _this.state.connected = newConnectionState;
      _this.onChangeState(_this.pingerName, _this.state);
    }
  }

  onChangeState (pingerName, newState) {
    const _this = this;
    l.debug('pinger ' +pingerName + ' - ' + _this.wsServerAddress + ' local pinger state chaged: ', newState);
  }
};
