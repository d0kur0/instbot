const log = require('./app/modules/consoleLog');

module.exports = async (page) => {

  const SELECTOR_CLOSE_POPUP = 'button.ckWGn';
  const SELECTOR_REMOVE_POST = '.v1Nh3.kIKUG._bz0w > a';

  await page.mainFrame().waitForSelector(SELECTOR_CLOSE_POPUP)
    .then(() => {
      log.info('Найдена кнопка закрытия поп-ап поста');
    })
    .catch(() => {
      log.error('Не удалось найти кнопку закрытия поп-ап поста');
    });

  await page.click(SELECTOR_CLOSE_POPUP)
    .then(() => {
      log.success('Поп-ап поста успешно закрыт');
    })
    .catch(() => {
      log.error('Не удалось закрыть поп-ап поста');
    });

  await page.$eval(SELECTOR_REMOVE_POST', el => el.remove())
    .then(() => {
      log.success('Элемент поста успешно удалён из DOM');
    })
    .catch(() => {
      log.error('Не удалось удалить элемент поста из DOMы');
    });
};
