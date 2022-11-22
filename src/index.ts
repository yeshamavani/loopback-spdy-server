import * as fs from 'fs';
import path from 'path';
import spdy from 'spdy';
import {ApplicationConfig, NormalLoopbackApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const spdyOptions: spdy.ServerOptions = {
    key: fs.readFileSync(
      path.join(__dirname, '..', 'cert-files', 'localhost-privkey.pem'),
    ),
    cert: fs.readFileSync(
      path.join(__dirname, '..', 'cert-files', 'localhost-cert.pem'),
    ),
  };

  options.rest.listenOnStart = false;

  const app = new NormalLoopbackApplication(options);
  await app.boot();
  await app.start();

  // create spdy h2 server
  const server = spdy.createServer(spdyOptions, app.requestHandler);

  //ignore the warnings
  server.on('warning', warn => {
    console.log(warn.stack);
  });

  server.listen(options.rest.port, () => {
    console.log(
      `Listening on https://${app.options.rest.host}:${app.options.rest.port}/`,
    );
  });

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3010),
      host: process.env.HOST ?? 'localhost',
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
