const async = require('async');
const request = require('request');

module.exports.fetchSites = callback => {
  const SOURCE_URL = 'https://www.dnt.no/api/v2/site/';
  var hostnames = [];
  var next = '?limit=200';

  async.whilst(
    () => next !== null,
    (callback) => {
      request.get(SOURCE_URL + next, (err, res) => {
        const data = JSON.parse(res.body);
        data.objects.forEach(site => hostnames.push(site.domain));
        next = data.meta.next;
        callback(err);
      });
    },
    () => { callback(hostnames); }
  );
}
