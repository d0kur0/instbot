const log = require(`${_app}/modules/consoleLog`);
const limiter = require(`${_app}/modules/limiter.js`);
const botSettings = require(`${_app}/configs/botSettings.js`);

module.exports = async page => {
  const SELECTOR_LIKE_BUTTON = ".ltpMr.Slqrh > .fr66n > .wpO6b";
  const SELECTOR_LIKE_BUTTON_CHILD = `${SELECTOR_LIKE_BUTTON} > svg`;

  await page
    .mainFrame()
    .waitForSelector(SELECTOR_LIKE_BUTTON)
    .then(() => {
      log.info("Кнопка лайка успешно отрендерилась");
    })
    .catch(() => {
      log.error("Рендеринг кнопки лайка завершился ошибкой");
    });

  let likeExists = await page.evaluate(s => {
    const svgElement = document.querySelector(s);
    if (!svgElement) return false;

    return svgElement.getAttribute("fill") === "#ed4956";
  }, SELECTOR_LIKE_BUTTON_CHILD);

  if (!likeExists) {
    const todayLikes = await limiter.getField("likes");
    if (todayLikes >= botSettings.maxLikesPeerDay) {
      log.error("Лимит лайков на сегодня исчерпан");
      return false;
    }

    await limiter.incrementField("likes");

    await page
      .click(SELECTOR_LIKE_BUTTON)
      .then(() => {
        log.success("Лайк успешно поставлен");
      })
      .catch(() => {
        log.error("Не удалось поставить лайк");
      });

    return true;
  } else {
    log.info("Лайк уже стоит, пропуск");
    return false;
  }
};
