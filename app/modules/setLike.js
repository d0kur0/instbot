const log = require('./app/modules/consoleLog');

module.exports = async (page) => {

  const SELECTOR_LIKE_BUTTON       = '.dCJp8.afkep.coreSpriteHeartOpen._0mzm-';
  const SELECTOR_LIKE_BUTTON_CHILD = '.dCJp8.afkep.coreSpriteHeartOpen._0mzm- > span';
  const CLASS_IF_LIKE_EXISTS       = 'glyphsSpriteHeart__filled__24__red_5';

  await page.mainFrame().waitForSelector(SELECTOR_LIKE_BUTTON)
    .then(() => {
      log.info('Кнопка лайка успешно отрендерилась');
    })
    .catch(() => {
      log.error('Рендеринг кнопки лайка завершился ошибкой');
    });

  let likeExists = await page.$eval(SELECTOR_LIKE_BUTTON_CHILD, (el, CLASS_IF_LIKE_EXISTS) => {
    el.classList.contains(CLASS_IF_LIKE_EXISTS)
  }, CLASS_IF_LIKE_EXISTS);

  if (!likeExists) {
    await page.click(SELECTOR_LIKE_BUTTON)
      .then(() => {
        log.success('Лайк успешно поставлен');
      })
      .catch(() => {
        log.error('Не удалось поставить лайк');
      });

    return true;
  } else {
    log.info('Лайк уже стоит, пропуск');
    return false;
  }
};
