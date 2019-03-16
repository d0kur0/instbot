const log = require(`${_app}/modules/consoleLog`);

module.exports = async (page) => {

  const SELECTOR_CHECK_SUBSCRIBE  = 'div.PQo_0 > div.bY2yH > button:not(._8A5w5)';
  const SELECTOR_BUTTON_SUBSCRIBE = 'div.PQo_0 > div.bY2yH > button';

  let existsBtn = await page.$(SELECTOR_CHECK_SUBSCRIBE);

  if (existsBtn) {
    await page.click(SELECTOR_BUTTON_SUBSCRIBE)
      .then(() => {
        log.success('Подписка прошла успешно');
      })
      .catch(() => {
        log.error('Не удалось подписаться');
      });

    return true;
  }

  return false;
};
