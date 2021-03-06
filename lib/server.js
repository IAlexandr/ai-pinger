import { Server } from 'http';
import l from './logger';
import api from './api';
import config from './../test-config';
import transmitter from './transmitter';

const httpServer = Server(api());
httpServer.listen(config.props.port);
l.debugging ? l.log('DEBUG MODE.') : l.log('QUIET MODE.');
l.log('Server listenning on port: ' + config.props.port);
transmitter.init({ server: httpServer, config });
