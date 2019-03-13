const log = require('./consoleLog.js');
const sleep = require('./sleep.js');

module.exports = async (page, options) => {
  let existsBtn = await page.$('div.PQo_0 > div.bY2yH > button:not(._8A5w5)');

  if (existsBtn) {
    await page.click('div.PQo_0 > div.bY2yH > button')
      .then(() => {
        log.success('Have successfully subscribed');
      })
      .catch(() => {
        log.error('A subscription button was found but could not be signed');
      });

    await sleep(options.bot.delayBeforeSubscribe);
  }
};
