const moment = require('moment');
const request = require('request');

const data = require('./data');

module.exports.notify = (() => {
  const sites = data.getSiteStatus();
  process.env.NOTIFICATION_DAYS.split(',').forEach(days => {
    sites.filter(site => site.validity.diff(moment(), 'days') == days).forEach(
      site => this._slackNotification(site.hostname, days)
    );
  })
});

module.exports._slackNotification = ((hostname, days) => {
  const payload = JSON.stringify({
    username: 'SSL certificate expiration notification manager authority',
    icon_emoji: ':lock:',
    text: `Warning: The SSL certificate for https://${hostname} expires in ${days} days. <https://${process.env.WEBSERVER_HOSTNAME}|See overview>.`,
  });

  request.post({
    url: process.env.SLACK_WEBHOOK_URL,
    body: payload,
  }, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
});
