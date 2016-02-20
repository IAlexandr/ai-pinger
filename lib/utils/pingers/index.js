import Pinger from './../pingers/pinger';
import l from './../../logger';

export default class Pingers {
  constructor (props) {
    const _this = this;
    const {configPingersInfo, servers} = props;
    _this.configPingersInfo = configPingersInfo;
    _this.pingers = {};
    _this.servers = servers;
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
    Object.keys(pingersInfo).forEach((pingerName)=>{
      const wsServerAddress = _this.prepWsServerAddress(pingersInfo[pingerName]);
      if (wsServerAddress) {
        _this.pingers[pingerName] = new Pinger({ wsServerAddress });
      }
    });
    l.log('pingers initialized. (' + Object.keys(_this.pingers).length + ').');
  }

  prepWsServerAddress (pingerInfo) {
    const _this = this;
    let resultAddress;
    if (_this.servers.hasOwnProperty(pingerInfo.name)) {
      const serverInfo = _this.servers[pingerInfo.name];
      const network = serverInfo.network[pingerInfo.network];
      let tempAddress;
      if (network.hasOwnProperty('dnsName')) {
        tempAddress = network.dnsName + ':' + pingerInfo.port;
      } else if (network.hasOwnProperty('ip')) {
        tempAddress = network.ip + ':' + pingerInfo.port;
      }
      if (tempAddress) {
        resultAddress = 'ws://' + tempAddress;
      }
    } else {
      l.log('Для подключения пингера нет информации по серверу ' + pingerInfo.name);
    }
    return resultAddress;
  }
}