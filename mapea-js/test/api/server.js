const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const DIR = path.resolve(__dirname, '..', '..');

const mimeType = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[/\\])+/, '');
  const pathname = path.join(DIR, sanitizePath);

  fs.exists(pathname, (exist) => {
    if (!exist) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        const ext = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.end(data);
      }
    });
  });
});

module.exports = server;
