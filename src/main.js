const cron = require('cron');

const data = require('./data');
const notify = require('./notify');
const web = require('./web');

// Ensure we have the lastest data on startup
data.saveSiteStatus();

// Update site list and certificates nightly
new cron.CronJob('00 00 04 * * *', data.saveSiteStatus, null, true, 'Europe/Oslo');

// Send any notifications at 08:00 in the morning
new cron.CronJob('00 00 08 * * *', notify.notify, null, true, 'Europe/Oslo');

// Start the HTTP server
web.serve();
