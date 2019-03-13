const log = require('./consoleLog.js');

module.exports = async (page) => {
  await page.mainFrame().waitForSelector('button.ckWGn')
    .then(() => {
      log.info('Найдена кнопка закрытия поп-ап поста');
    })
    .catch(() => {
      log.error('Не удалось найти кнопку закрытия поп-ап поста');
    });

  await page.click('button.ckWGn')
    .then(() => {
      log.success('Поп-ап поста успешно закрыт');
    })
    .catch(() => {
      log.error('Не удалось закрыть поп-ап поста');
    });

  await page.$eval('.v1Nh3.kIKUG._bz0w > a', el => el.remove())
    .then(() => {
      log.success('Элемент поста успешно удалён из DOM');
    })
    .catch(() => {
      log.error('Не удалось удалить элемент поста из DOMы');
    });
};
