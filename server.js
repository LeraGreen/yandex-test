const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;

const requestHandler = (request, response) => {
  const pURL = url.parse(request.url);
  const filename = path.join(__dirname, pURL.pathname);
  if (filename.indexOf(__dirname) !== 0) {
    response.writeHead(403, { 'Content-Type': 'text/plain' });
    response.end('Forbidden');
    return;
  }
  let contentType = 'text/plain';
  if (/\.html$/.test(pURL.pathname)) {
    contentType = 'text/html';
  } else if (/\.css$/.test(pURL.pathname)) {
    contentType = 'text/css';
  } else if (/\.js$/.test(pURL.pathname)) {
    contentType = 'application/js';
  } else if (/\.json$/.test(pURL.pathname)) {
    contentType = 'application/json';
  }
  fs.readFile(filename, 'UTF-8', (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end(JSON.stringify(err, null, 2));
      return;
    }
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(data);
  });
}

const server = http.createServer(requestHandler).listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
