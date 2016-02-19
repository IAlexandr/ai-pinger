var NODEJS = 'nodejs';
var IIS = 'iis';
var NODEIIS = 'nodeiis';

var servers = {
  'aipc-ecqx25v7': {
    description: 'AI PC',
    network: {
      'internet': {
        ip: '',
        gtw: '',
        dns: '',
        dnsName: 'aipc-ecqx25v7.cloudapp.net'
      }
    }
  },
  'si-sdai': {
    description: 'AI PC',
    network: {
      '110.10.0': {
        ip: '110.10.0.227',
        gtw: '',
        dns: '',
        dnsName: 'si-sdai'
      }
    }
  },
  'si-sdarcmap': {
    description: 'sd ARCMAP',
    network: {
      '110.10.0': {
        ip: '110.10.0.254',
        gtw: '',
        dns: '',
        dnsName: 'si-sdarcmap'
      }
    }
  }
};

module.exports = {
  props: {
    description: 'Тестовый родительский пингер',
    serverName: 'si-sdai',  // наименование машины где установлен.
    port: 8088, // порт на котором запущен ws и api
  },
  pinger: { // ключ - наименование машины где установлен пингер к которому подключается.
    'si-sdarcmap': {
      network: '110.10.0',
      port: 8088
    },
    'aipc-ecqx25v7': {
      parent: true,
      network: 'internet',
      port: 8088
    }
  },
  server: servers
};
