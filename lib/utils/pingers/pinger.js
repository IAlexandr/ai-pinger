import WS from 'ws';
import l from './../../logger';
import WSClient from './../../ws-client';

export default class Pinger {
  constructor (props) {
    const _this = this;
    const { wsServerAddress, onChangeState } = props;
    _this.wsServerAddress = wsServerAddress;
    _this.onChangeState = onChangeState || _this.onChangeState;
    _this.state = {
      connected: false,
      info: {}
    };
    _this.wsSocket = new WSClient({
      wsServerAddress,
      onMessage: _this.onMessage.bind(_this),
      onChangeConnectionState: _this.onChangeConnectionState.bind(_this)
    });
  }

  onMessage (msg) {
    const _this = this;
    console.log(_this.wsServerAddress + '!!!!!! pinger: incoming message.', msg);
    _this.state.info = JSON.parse(msg);
    _this.onChangeState(_this.state);
  }

  onChangeConnectionState (newConnectionState) {
    const _this = this;
    if (_this.state.connected !== newConnectionState) {
      _this.state.connected = newConnectionState;
      _this.onChangeState(_this.state);
    }
  }

  onChangeState (newState) {
    const _this = this;
    console.log(_this.wsServerAddress + ' local pinger state chaged.');
  }
};
