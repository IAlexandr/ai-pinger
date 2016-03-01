import Pinger from './../pingers/pinger';
import l from './../../logger';
import dns from 'dns';
import async from 'async';

export default class Pingers {
  constructor (props) {
    const _this = this;
    const { configPingersInfo, servers, onChangeState } = props;
    _this.onChangeState = onChangeState;// || _this.onChangeState;
    _this.configPingersInfo = configPingersInfo;
    _this.pingers = {};
    _this.servers = servers;
    _this.state = {};
    _this.initializing();
  }

  initializing () {
    l.log('pingers initializing..');
    const _this = this;
    const pingersInfo = {};
    Object.keys(_this.configPingersInfo).forEach((pingerName) => {
      const pingerInfo = _this.configPingersInfo[pingerName];
      if (!pingerInfo.parent) {
        pingerInfo.name = pingerName;
        pingersInfo[pingerName] = pingerInfo;
      }
    });
    async.each(Object.keys(pingersInfo), (pingerName, done) => {
      _this.pingerInitialize(pingersInfo[pingerName], done);
    }, () => {
      l.log('pingers initialized. (' + Object.keys(_this.pingers).length + ').');
    });
  }

  pingerInitialize (pingerInfo, cb) {
    const _this = this;
    const pingerName = pingerInfo.name;
    _this.prepWsServerAddresses(pingerInfo, (err, wsServerAddresses) => {
      if (!err) {
        if (typeof wsServerAddresses === 'object' && wsServerAddresses.length > 0) {
          _this.pingers[pingerName] = new Pinger(
            {
              pingerName,
              wsServerAddresses,
              onChangeState: _this.onChangeStateLocal.bind(_this)
            }
          );
        }
      }
      return cb();
    });
  }

  prepWsServerAddresses (pingerInfo, cb) {
    const _this = this;
    const resultAddresses = [];
    if (_this.servers.hasOwnProperty(pingerInfo.name)) {
      const serverInfo = _this.servers[pingerInfo.name];
      const network = serverInfo.network[pingerInfo.network];
      let tempAddress;
      if (network.hasOwnProperty('dnsName') && network.dnsName !== '') {
        dns.lookup(network.dnsName, {all:true}, (err, addresses) => {
          if (err) {
            l.debug(err);
            if (network.hasOwnProperty('ip')) {
              resultAddresses.push('ws://' + network.ip + ':' + pingerInfo.port);
              return cb(null, resultAddresses);
            } else {
              return cb(err);
            }
          }
          addresses.forEach((addressInfo) => {
            resultAddresses.push('ws://' + addressInfo.address + ':' + pingerInfo.port);
          });
          return cb(null, resultAddresses);
        });
      } else if (network.hasOwnProperty('ip')) {
        resultAddresses.push('ws://' + network.ip + ':' + pingerInfo.port);
        return cb(null, resultAddresses);
      }
    } else {
      return cb(new Error ('Для подключения пингера нет информации по серверу ' + pingerInfo.name));
    }
  }

  onChangeStateLocal (pingerName, newState) {
    const _this = this;
    _this.state[pingerName] = newState;
    _this.onChangeState(_this.state);
  }
}
