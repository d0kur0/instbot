const log                = require(`${_app}/modules/consoleLog`);
const messages           = require(`${_app}/configs/messagesList`);
const { PendingXHR }     = require('pending-xhr-puppeteer');

module.exports = async (page) => {

  const SELECTOR_COMMENT_FIELD = 'textarea.Ypffh';
  const KEYCODE_FOR_SEND       = 'Enter';

  await page.mainFrame().waitForSelector(SELECTOR_COMMENT_FIELD)
    .then(async () => {
      let message = messages[Math.floor(Math.random() * messages.length)];

      await page.focus(SELECTOR_COMMENT_FIELD);

      await page.keyboard.type(message)
        .then(() => {
          log.success('Заполнил поле ввода комментарий');
        })
        .catch(() => {
          log.error('Не удалось ввести текст комментария в поле ввода');
        });

      const pendingXHR = new PendingXHR(page);

      await page.keyboard.press(KEYCODE_FOR_SEND)
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
