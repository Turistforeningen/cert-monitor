const http = require('http');
const swig  = require('swig');

const data = require('./data');

module.exports.serve = (() => {
  http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(swig.renderFile('templates/index.html', {sites: data.getSiteStatus()}));
  }).listen(8000);
});
