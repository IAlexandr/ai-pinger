import superagent from 'superagent';
import l from './../../../logger';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
  'Content-Type' : 'application/x-www-form-urlencoded'
};
const INTERVAL = 30000;
export default class HttpRequester {
  constructor (props) {
    const { address, onChangeState } = props;
    this.to = null;
    this.address = address;
    this.state = {
      online: null
    };
    this.onChangeState = onChangeState;
    this.start();
  }

  start () {
    this.request();
    l.log('HttpRequester (' + this.address + ') initialized.');
  }

  request () {
    const _this = this;
    superagent.get(_this.address)
      .accept('application/json')
      .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0')
      .end((err, res) => {
        if (err) {
          l.debug('HttpRequester (' + _this.address + ') err', err);
          _this.onChangeStateOnline(false);
        } else {
          _this.onChangeStateOnline(true);
        }
        _this.timeout();
      });
  }

  timeout () {
    const _this = this;
    this.to = setTimeout(() => {
      _this.request();
    }, INTERVAL);
  }

  stop () {
    clearInterval(this.to);
  }

  onChangeStateOnline (isOnline) {
    if (this.state.online !== isOnline) {
      this.state.online = isOnline;
      this.onChangeState(this.state);
    }
  }

}
