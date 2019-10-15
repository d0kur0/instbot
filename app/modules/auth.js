const log = require(`${_app}/modules/consoleLog`);
const authData = require(`${_app}/configs/authData`);
const { PendingXHR } = require('pending-xhr-puppeteer');

module.exports = async (page) => {

  const SIGNIN_PAGE                 = 'https://www.instagram.com/accounts/login/';
  const SELECTOR_USERNAME_FIELD     = 'input[name="username"]';
  const SELECTOR_PASSWORD_FIELD     = 'input[name="password"]';
  const SELECTOR_SUBMIT_BUTTON      = 'button[type="submit"]';
  const SELECTOR_CHECK_AUTH         = 'svg[aria-label="Profile"]';
  const CANCEL_NOTIFICATIONS_BUTTON = '.aOOlW.HoLwm';

  log.header('Начинаю авторизацию...');
  await page.goto(SIGNIN_PAGE);

  log.info('Ожидание, пока отрисуются поля формы авторизации');

  await page.mainFrame().waitForSelector(SELECTOR_USERNAME_FIELD)
    .then(async () => {
      log.info('Поле для ввода имени пользователя отрисовано, заполнение');

      await page.focus(SELECTOR_USERNAME_FIELD);
      await page.keyboard.type(authData.username);
    })
    .catch(() => {
      log.error('Поле ввода имени пользователя не отрендерилось');
    });

  await page.mainFrame().waitForSelector(SELECTOR_PASSWORD_FIELD)
    .then(async () => {
      log.success('Поле для ввода пароля отрисовано, заполнение');

      await page.focus(SELECTOR_PASSWORD_FIELD);
      await page.keyboard.type(authData.password);
    })
    .catch(() => {
      log.error('Поле ввода пароля не отрендерилось');
    });

  const pendingXHR = new PendingXHR(page);

  await page.click(SELECTOR_SUBMIT_BUTTON)
    .then(() => {
      log.success('Поля заполнены, отправка формы');
    })
    .catch(() => {
      log.error('Произошла ошибка отправки формы авторизации');
    });

  await pendingXHR.waitForAllXhrFinished()
    .then(() => {
      log.info('Все XHR запросы завершены');
    });

  await page.waitForNavigation();

  const isOpenNotifications = await page.evaluate((s) => Boolean(document.querySelector(s)), CANCEL_NOTIFICATIONS_BUTTON);

  if (isOpenNotifications) {
    log.info('Обнаружено окно с push-уведомлениями, отклоняем');

    await page.click(CANCEL_NOTIFICATIONS_BUTTON)
      .then(() => {
        log.success('Успешно отклонили');
      })
      .catch(() => {
        log.error(`Неудалось кликнуть на "${CANCEL_NOTIFICATIONS_BUTTON}"`);
      });
  }

  log.info(`Ожидание появление в DOM дереве элемента с селектором: "${SELECTOR_CHECK_AUTH}"`);

  await page.mainFrame().waitForSelector(SELECTOR_CHECK_AUTH)
    .then(() => {
      log.success(`Элемент с селектором "${SELECTOR_CHECK_AUTH}" отрисован`);
    })
    .catch(() => {
      log.error(`Элемент с селектором "${SELECTOR_CHECK_AUTH}" не был отрисован`);
    });

  const authResponse = await page.evaluate((SELECTOR_CHECK_AUTH) => {
    return Boolean(document.querySelector(SELECTOR_CHECK_AUTH));
  }, SELECTOR_CHECK_AUTH);

  if (!authResponse) {
    log.error('Авторизация не удалась')
    return false;
  }

  log.success('Авторизация прошла успешно ❤');
  return true;
};
