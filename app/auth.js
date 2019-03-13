const log = require('./consoleLog.js');
const chalk = require('chalk');

module.exports = async (page, authData) => {

  log.header('Начинаю авторизацию...');
  await page.goto('https://instagram.com/accounts/login/');

  log.info('Ожидание, пока отрисуеются поля формы авторизации');

  // Await username field and filling
  await page.mainFrame().waitForSelector('input[name="username"]')
    .then(async () => {
      log.info('Поле для ввода имени пользователя отрисовано, заполнение');

      await page.focus('input[name="username"]');
      await page.keyboard.type(authData.username);
    })
    .catch(() => {
      log.error('Поле ввода имени пользователя не отрендерилось');
    });

  // Await password field and filling
  await page.mainFrame().waitForSelector('input[name="password"]')
    .then(async () => {
      log.success('Поле для ввода пароля отрисовано, заполнение');

      await page.focus('input[name="password"]');
      await page.keyboard.type(authData.password);
    })
    .catch(() => {
      log.error('Поле ввода пароля не отрендерилось');
    });

  await page.click('button[type="submit"]')
    .then(() => {
      log.success('Поля заполнены, отправка формы');
    })
    .catch(() => {
      log.error('Произошла ошибка отправки формы авторизации');
    });

  // Await auth request
  await page.waitForResponse('https://www.instagram.com/accounts/login/ajax/');

  await page.goto('https://instagram.com')
    .then(() => {
      log.success('Открытие instagram.com для проверки авторизации');
    })
    .catch(() => {
      log.error('Не удалось открыть instagram.com');
    });

  await page.mainFrame().waitForSelector('div.mt3GC > button.aOOlW.HoLwm')
    .then(() => {
      log.success('Ожидание появление в DOM дереве элемента с селектором div.mt3GC > button.aOOlW.HoLwm appeared');
    })
    .catch(() => {
      log.error('Элемент с селектором div.mt3GC > button.aOOlW.HoLwm не был отрисован');
    });

  const authResponse = await page.evaluate(() => Boolean(document.querySelector('div.mt3GC > button.aOOlW.HoLwm')));

  if (!authResponse) {
    log.error('Авторизация не удалась')
    return false;
  }

  log.success('Авторизация прошла успешно ❤');
  return true;
};
