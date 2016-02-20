import express from 'express';
import { version } from './../../../package.json';
import transmitter from './../../transmitter';
const router = express.Router();

export default router;

router.get('/', function (req, res) {
  res.json({
    name: transmitter.config.props.serverName,
    version
  });
});

router.get('/config', function (req, res) {
  res.json(transmitter.config);
});

router.get('/state', function (req, res) {
  res.json(transmitter.pingers.state);
});
