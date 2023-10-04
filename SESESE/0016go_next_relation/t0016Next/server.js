const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', '..', 'key', 'server_unencrypted.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', '..', 'key', 'server.pem')),
  // key: fs.readFileSync('../../key/server_unencrypted.key'),
  // cert: fs.readFileSync('../../key/server.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});




//// next.config.jsにhttps設定する場合…一般的ではない？
// const { createServer } = require('https');
// const { readFileSync } = require('fs');
// const { parse } = require('url');
// const next = require('next');

// const httpsOptions = {
//   key: readFileSync('key/server.key'),
//   cert: readFileSync('key/server.cert'),
// };

// const app = next({ dev: process.env.NODE_ENV !== 'production' });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   createServer(httpsOptions, (req, res) => {
//     const parsedUrl = parse(req.url, true);
//     handle(req, res, parsedUrl);
//   }).listen(3000, (err) => {
//     if (err) throw err;
//     console.log('> Ready on https://localhost:3000');
//   });
// });
