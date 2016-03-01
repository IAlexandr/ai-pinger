import dns from 'dns';
import async from 'async';
import Pingers from './utils/pingers';
import l from './logger';
import WSServer from './ws-server';
import {version} from './../package.json';
import NotificationServiceClient from './notification-service-client';
import Requester from './utils/requester';

export default {

  init (props) {
    const { server, config } = props;
    const _this = this;
    _this.server = server;
    _this.config = config;
    _this.state = {
      version,
      pingers: {},
      requesters: {}
    };
    _this.pingers = null;
    _this.requesters = {};
    _this.WSServer = null;
    _this.NSClient = null;
    _this.createWSServer();
    _this.initializePingers();
    _this.initializeNotificationService();
    _this.initializeAppRequesters();
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
          dns.lookup(network.dnsName || network.ip, { all: true }, (err, addresses) => {
            if (err) {
              return done(err);
            }
            addresses.forEach((adressInfo) => {
              resultRegHosts.push(adressInfo.address);
            });
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
    const _this = this;
    if (_this.to) {
      clearTimeout(_this.to);
    }
    _this.to = setTimeout(() => {
      _this.WSServer.broadcast(JSON.stringify(_this.state));
      if (_this.NSclient) {
        _this.NSclient.send(_this.state);
      }
    }, 1000);
  },

  onRequesterStateChange (newState) {

  },

  initializeAppRequesters () {
    const _this = this;
    const { app } = _this.config;

    if (typeof app === 'object' && Object.keys(app).length > 0) {
      Object.keys(app).forEach((appName) => {
        _this.requesters[appName] = new Requester(
          {
            ...app[appName],
            ...{
              onChangeState: (newState) => {
                _this.state.requesters[appName] = newState;
                l.debug('transmitter.onRequesterStateChange: _this.state.requesters (stringify) ', JSON.stringify(_this.state.requesters));
                _this.onChangeState();
              }
            }
          });
      });
    }
    l.debug('appRequesters initialized.');
  }

};
