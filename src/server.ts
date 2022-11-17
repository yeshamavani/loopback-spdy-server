import * as fs from 'fs';
import path from 'path';
import spdy from 'spdy';
import {NormalLoopbackApplication as App} from './application';

let options: spdy.ServerOptions = {
  key: fs.readFileSync(
    path.join(__dirname, '..', 'cert-files', 'localhost-privkey.pem'),
  ),
  cert: fs.readFileSync(
    path.join(__dirname, '..', 'cert-files', 'localhost-cert.pem'),
  ),
};

let lbApp = new App({
  rest: {
    listenOnStart: false,
  },
});

async function http2SpdyServer() {
  //create http2 server using spdy
  const server = spdy.createServer(options, lbApp.requestHandler);

  lbApp.boot().then(async () => {
    await lbApp.start();
    const url = lbApp.restServer.url;
    server.on('request', (req, res) => {
      // infact no need to translate the request and response
      //Atleast for now will have to still check other edge cases
      /*lbApp.requestHandler(
        requestAdapter(req.spdyStream),
        responseAdapter(res)
      ); */
      lbApp.requestHandler(req, res);
    });
    //ignore the warnings
    server.on('warning', warn => {
      console.log(warn.stack);
    });
  });

  server.listen(3000);
}

http2SpdyServer().catch(err => {
  console.error('Cannot start the application.', err);
  process.exit(1);
});
// ### TODO
//figure out a way to use the explorer through this
// also check our authentication and authorization mechanism(works properly or not)
