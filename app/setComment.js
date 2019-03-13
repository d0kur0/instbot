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
          log.info('Ожидание завершения всех XHR запросов');
        });
    })
    .catch(() => {
      log.error('Не удалось найти поле ввода коментария');
    });
};
