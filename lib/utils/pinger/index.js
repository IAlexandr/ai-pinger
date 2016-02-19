import WS from 'ws';
import l from './../../logger';
import WSClient from './../../ws-client';

export default class Pinger {
  constructor (props) {
    const _this = this;
    _this.wsParentServerAddress = prepParentServerAddress(config);
    _this.wsSocket = null;
  }

  
};
