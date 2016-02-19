import Pinger from './../pinger';
import l from './../logger';

export default class ParentPingers {
  constructor (configPingersInfo) {
    const _this = this;
    _this.configPingersInfo = configPingersInfo;
    _this.pinger = null;
    _this.initializing();
  }

  initializing () {
    l.log('parent-pingers initializing..');
    const _this = this;
    const parentPingersInfo = [];
    const parentPingers = {};
    Object.keys(_this.configPingersInfo).forEach((pingerName) => {
      const pingerInfo = _this.configPingersInfo[pingerName];
      if (pingerInfo.parent) {
        pingerInfo.name = pingerName;
        parentPingersInfo.push(pingerInfo);
      }
    });
    if (parentPingersInfo.length === 1) {
      _this.pinger = new Pinger(parentPingersInfo[0]);
    }

    if (parentPingersInfo.length > 1) {
      l.log('поддержку нескольких родителей (пингеров) не поддерживается, был взят первый: ' + parentPingersInfo[0].name);
      // TODO поддержку нескольких родителей (пингеров)
      _this.pinger = new Pinger(parentPingersInfo[0]);
    }
    l.log('parent-pingers initialized.');
  }

}
