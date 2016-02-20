import WS from 'ws';
import l from './../../logger';
import WSClient from './../../ws-client';

export default class Pinger {
  constructor (props) {
    const _this = this;
    const { wsServerAddress } = props;
    _this.wsServerAddress = wsServerAddress;
    _this.wsSocket = new WSClient({ wsServerAddress, onMessage: _this.onMessage });
  }

  onMessage (msg) {
    console.log('pinger: incoming message.', msg);
  }
};
