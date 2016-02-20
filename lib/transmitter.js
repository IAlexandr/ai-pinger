import dns from 'dns';
import async from 'async';
import Pingers from './utils/pingers';
import l from './logger';
import WSServer from './ws-server';

export default {

  init (props) {
    const { server, config } = props;
    const _this = this;
    _this.server = server;
    _this.config = config;
    _this.pingers = null;
    _this.createWSServer();
    _this.initializePingers();
    l.log('transmitter initialized.');
  },

  createWSServer () {
    const _this = this;
    l.log('creating WebSocketServer..');
    this.getRegHosts((err, regHosts) => {
      if (err) {
        l.log('getRegHosts: ', err);
        l.log('Разрешены все адреса.');
        regHosts = [];
      }
      console.log(regHosts);
      const wss = new WSServer({
        server: _this.server,
        regHosts,
        onMessage: (message) => {
          l.log('incoming message.');
        }
      });
    });
  },

  initializePingers () {
    const _this = this;
    _this.pingers = new Pingers({ configPingersInfo: _this.config.pinger, servers: _this.config.server });
  },

  getRegHosts (cb) {
    const _this = this;
    const { regHosts } = _this.config.props;
    if (regHosts) {
      const resultRegHosts = [];
      regHosts.forEach((serverInfo) => {
        const networks = serverInfo.network;
        async.eachLimit(networks, 1, (network, done) => {
          dns.lookup(network.dnsName || network.ip, (err, ip) => {
            if (err) {
              return done(err);
            }
            resultRegHosts.push(ip);
            return done();
          });
        }, (err) => {
          return cb(err, resultRegHosts);
        });
      });
    } else {
      return cb(null, []);
    }
  }

};
