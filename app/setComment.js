const log = require('./consoleLog.js');
const messages = require('./messages.js');
const { PendingXHR } = require('pending-xhr-puppeteer');

module.exports = async (page) => {
  await page.mainFrame().waitForSelector('textarea.Ypffh')
    .then(async () => {
      let message = messages[Math.floor(Math.random() * messages.length)];

      await page.focus('textarea.Ypffh');

      await page.keyboard.type(message)
        .then(() => {
          log.success('Заполнил поле ввода комментарий');
        })
        .catch(() => {
          log.error('Не удалось ввести текст комментария в поле ввода');
        });;

      const pendingXHR = new PendingXHR(page);
      await page.keyboard.press('Enter')
        .then(() => {
          log.success('Эмуляция отправки комментария');
        });
      await pendingXHR.waitForAllXhrFinished()
        .then(() => {
          log.info('Все XHR запросы завершены');
        });
    })
    .catch(() => {
      log.error('Не удалось найти поле ввода коментария');
    });
};
