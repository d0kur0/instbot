const log = require(`${_app}/modules/consoleLog`);
const messages = require(`${_app}/configs/messagesList`);
const { PendingXHR } = require("pending-xhr-puppeteer");
const limiter = require(`${_app}/modules/limiter.js`);
const botSettings = require(`${_app}/configs/botSettings.js`);

module.exports = async page => {
  const SELECTOR_COMMENT_FIELD = "textarea.Ypffh";
  const KEYCODE_FOR_SEND = "Enter";

  const todayComments = await limiter.getField("comments");
  if (todayComments >= botSettings.maxCommentsPeerDay) {
    log.error("Лимит комментариев на сегодня исчерпан");
    return false;
  }

  await limiter.incrementField("comments");

  await page
    .mainFrame()
    .waitForSelector(SELECTOR_COMMENT_FIELD)
    .then(async () => {
      let message = messages[Math.floor(Math.random() * messages.length)];

      await page.focus(SELECTOR_COMMENT_FIELD);

      await page.keyboard
        .type(message)
        .then(() => {
          log.success("Заполнил поле ввода комментарий");
        })
        .catch(() => {
          log.error("Не удалось ввести текст комментария в поле ввода");
        });

      const pendingXHR = new PendingXHR(page);

      await page.keyboard.press(KEYCODE_FOR_SEND).then(() => {
        log.success("Эмуляция отправки комментария");
      });

      await pendingXHR.waitForAllXhrFinished().then(() => {
        log.info("Все XHR запросы завершены");
      });
    })
    .catch(() => {
      log.error("Не удалось найти поле ввода коментария");
    });
};
