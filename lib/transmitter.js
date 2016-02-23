import dns from 'dns';
import async from 'async';
import Pingers from './utils/pingers';
import l from './logger';
import WSServer from './ws-server';
import { version } from './../package.json';
import NotificationServiceClient from './notification-service-client';

export default {

  init (props) {
    const { server, config } = props;
    const _this = this;
    _this.server = server;
    _this.config = config;
    _this.state = {
      version,
      pingers: {}
    };
    _this.pingers = null;
    _this.WSServer = null;
    _this.NSClient = null;
    _this.createWSServer();
    _this.initializePingers();
    _this.initializeNotificationService();
    l.debug('transmitter initialized.');
  },

  createWSServer () {
    const _this = this;
    l.debug('creating WebSocketServer..');
    this.getRegHosts((err, regHosts) => {
      if (err) {
        l.debug('getRegHosts: ', err);
        l.debug('Разрешены все адреса.');
        regHosts = [];
      }
      l.debug('regHosts: ', regHosts);
      _this.WSServer = new WSServer({
        server: _this.server,
        path: _this.config.props.serverName,
        regHosts,
        onConnect: (client) => {
          l.debug('transmitter.onConnect client.send (stringify): ', _this.state);
          client.send(JSON.stringify(_this.state));
        },
        onMessage: (msg) => {
          l.debug('transmitter.onMessage: incomming message (parse).. just console', JSON.parse(msg));
        }
      });
    });
  },

  initializePingers () {
    const _this = this;
    _this.pingers = new Pingers({
      configPingersInfo: _this.config.pinger,
      servers: _this.config.server,
      onChangeState: _this.onPingersStateChange.bind(_this)
    });
  },

  initializeNotificationService () {
    const _this = this;
    if (_this.config.hasOwnProperty('notificationService')) {
      _this.NSclient = new NotificationServiceClient(_this.config.notificationService);
    }
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
  },

  onPingersStateChange (newState) {
    this.state.pingers = newState;
    l.debug('transmitter.onPingersSateChange: this.WSServer.broadcast newState (stringify) ', JSON.stringify(this.state));
    this.onChangeState();
  },

  onChangeState () {
    this.WSServer.broadcast(JSON.stringify(this.state));
    if (this.NSclient) {
      this.NSclient.send(this.state);
    }
  }
};
