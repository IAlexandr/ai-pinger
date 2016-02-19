import express from 'express';
import routes from './routes';

export default function () {
  var app = express();

  app.set('json spaces', 2);
  routes.forEach(function (route) {
    app.use(route.mountPoint, route.router);
  });
  return app;
};
