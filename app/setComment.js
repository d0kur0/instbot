const log = require('./consoleLog.js');
const messages = require('./messages.js');
const { PendingXHR } = require('pending-xhr-puppeteer');

module.exports = async (page) => {
  await page.mainFrame().waitForSelector('textarea.Ypffh')
    .then(async () => {
      let message = messages[Math.floor(Math.random() * messages.length)];

      await page.focus('textarea.Ypffh');
      await page.keyboard.type(message);

      const pendingXHR = new PendingXHR(page);
      await page.keyboard.press('Enter');
      await pendingXHR.waitForAllXhrFinished()
        .then(() => {
          log.info('Waiting for XHR requests to complete');
        });
    })
    .catch(() => {
      log.error('The input field of the comment is not found');
    });
};
