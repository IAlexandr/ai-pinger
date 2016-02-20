import { Server } from 'http';
import l from './logger';
import api from './api';
import config from './../test-config';
import WSServer from './ws-server';
import Pingers from './utils/pingers';

function init(httpServer) {
  l.log('creating WebSocketServer..');
  const wss = new WSServer({
    server: httpServer,
    regHosts: ['127.0.0.1'],
    onMessage: (message) => {
      l.log('incoming message.');
    }
  });
  const Pingers = Pingers(config.pinger, config.server);
}

const httpServer = Server(api());
httpServer.listen(config.props.port);
l.log('Server listenning on port: ' + config.props.port);
init(httpServer);
