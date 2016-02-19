import express from 'express';
import { version } from './../../../package.json';
const router = express.Router();

export default router;

router.get('/', function (req, res) {
  res.json({
    name: 'ai-pinger',
    version
  });
});
