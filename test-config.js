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
  },
  'si-sdgis': {
    description: 'sd gis',
    network: {
      '110.10.0': {
        ip: '110.10.0.252',
        gtw: '',
        dns: '',
        dnsName: 'si-sdgis'//
      }
    }
  }
};

module.exports = {
  props: {
    description: 'Тестовый родительский пингер',
    serverName: 'si-sdai',  // наименование машины где установлен.
    port: 8089, // порт на котором запущен ws и api
    debugging: false,  // logMode
    //regHosts: ['11.11.11.11']  // если нет ключа или пустой массив, то разрешаются все адреса.
  },
  // notificationService: {
  //   host: '110.10.0.227',
  //   port: 4445,
  //   path: '', // without '/'
  //   types: ['slack']  // slack, gmail
  // },
  pinger: { // ключ - наименование машины где установлен пингер к которому подключается.
    // 'si-sdarcmap': {
    //   network: '110.10.0',
    //   port: 8089
    // },
    // 'aipc-ecqx25v7': {
    //   //parent: true, // при условии если у этого пингера нет прямого доступа к этому пингеру.
    //   network: 'internet',
    //   port: 8088
    // }
  },
  app: {
    'test http-server': {
      checkType: 'http',
      host: 'localhost',
      path: '',
      port: 8090
    },
  },
  server: servers
};
