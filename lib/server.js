import { Server } from 'http';
import l from './logger';
import api from './api';
import config from './../test-config';
import WSServer from './ws-server';
import WSClient from './ws-client';
import ParentPingers from './utils/pingers';

function init(httpServer) {
  l.log('creating WebSocketServer..');
  const wss = new WSServer({
    server: httpServer,
    regHosts: ['127.0.0.1'],
    onMessage: (message) => {
      l.log('incoming message.');
    }
  });
  const parentPingers = ParentPingers(config.pinger);
  const notifyServiceWSClient = WSClient();
}
const httpServer = Server(api());
httpServer.listen(config.props.port);
l.log('Server listenning on port: ' + config.props.port);
init(httpServer);
