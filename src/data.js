const fs = require('fs');
const moment = require('moment');
const tls = require('tls');

const sitesource = require('./sitesource');

const DATA_FILE = 'sites.json';

module.exports.getSiteStatus = (() => {
  return JSON.parse(fs.readFileSync(DATA_FILE)).map(site => {
    return {
      hostname: site.hostname,
      validity: moment(site.validity),
    };
  }).sort((a, b) => {
    if (a.validity.unix() < b.validity.unix()) {
      return -1;
    } else if (a.validity.unix() > b.validity.unix()) {
      return 1;
    } else {
      return 0;
    }
  });
});

module.exports.saveSiteStatus = (() => {
  sitesource.fetchSites(sites => {
    const validities = sites.map(hostname => {
      return new Promise((resolve, reject) => {
        const options = {
          port: 443,
          host: hostname,
          servername: hostname,
          rejectUnauthorized: false,
        };

        const socket = tls.connect(options, () => {
          // No need for further HTTP communication, just send FIN packet
          socket.end();

          resolve({
            hostname: hostname,
            validity: moment(socket.getPeerCertificate().valid_to, 'MMM DD HH:mm:ss YYYY'),
          });
        });

        socket.on('error', err => {
          // Ignore invalid hostnames and any temporary connection errors
          resolve(undefined);
        });

      });
    });

    Promise.all(validities).then(values => {
      fs.writeFile(DATA_FILE, JSON.stringify(values.filter(i => i !== undefined)));
    });
  })
});
