const log = require('./consoleLog.js');
const sleep = require('./sleep.js');

module.exports = async (page) => {
  await page.mainFrame().waitForSelector('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-')
    .then(() => {
      log.info('Кнопка лайка успешно отрендерилась');
    })
    .catch(() => {
      log.error('Рендеринг кнопки лайка завершился ошибкой');
    });

  let isExists = await page.$eval('.dCJp8.afkep.coreSpriteHeartOpen._0mzm- > span', el => el.classList.contains('glyphsSpriteHeart__filled__24__red_5'));

  if (!isExists) {
    await page.click('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-')
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
