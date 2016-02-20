import express from 'express';
import { version } from './../../../package.json';
import transmitter from './../../transmitter';
const router = express.Router();

export default router;

router.get('/', function (req, res) {
  console.log(transmitter);
  res.json({
    name: 'ai-pinger',
    version,
    state: transmitter.pingers.state
  });
});
