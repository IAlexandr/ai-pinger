
import l from './../../logger';
import HttpRequester from './types/http';

export default class Requester {

  constructor (props) {
    const { checkType, host, path, port, onChangeState } = props;
    switch (checkType) {
      case 'http':
        let address = host;
        address += port ? ':' + port : '';
        address += path ? '/' + path : '';
        this.requester = new HttpRequester({ address, onChangeState });
        break;
      default:
        l.debug('Requester checkType ' + checkType + ' not supported.');
        break;
    }
  }

};
