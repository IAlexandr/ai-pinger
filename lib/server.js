import { Server } from 'http';
import l from './logger';
import api from './api';
import config from './../test-config';
import WSServer from './ws-server';
import Pingers from './utils/pingers';
import dns from 'dns';
import async from 'async';

function getRegHosts (props, cb) {
  const regHosts = [];
  if (props.hasOwnProperty('regHosts')) {
    props.regHosts.forEach((serverInfo) => {
      const networks = serverInfo.network;
      async.eachLimit(networks, 1, (network, done) => {
        dns.lookup(network.dnsName || network.ip, (err, ip) => {
          if (err) {
            return done(err);
          }
          regHosts.push(ip);
          return done();
        });
      }, (err) => {
        return cb(err, regHosts);
      });
    });
  } else {
    return cb(null, []);
  }
}

function init(server) {
  l.log('creating WebSocketServer..');
  getRegHosts(config.props, (err, regHosts) => {
    if (err) {
      l.log('getRegHosts: ', err);
      l.log('Разрешены все адреса.');
      regHosts = [];
    }
    console.log(regHosts);
    const wss = new WSServer({
      server,
      regHosts,
      onMessage: (message) => {
        l.log('incoming message.');
      }
    });
  });

  const pingers = new Pingers({ configPingersInfo: config.pinger, servers: config.server });
}

const httpServer = Server(api());
httpServer.listen(config.props.port);
l.log('Server listenning on port: ' + config.props.port);
init(httpServer);
