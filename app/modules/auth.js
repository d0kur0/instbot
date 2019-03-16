const log      = require(`${_app}/modules/consoleLog`);
const authData = require(`${_app}/configs/authData`);

module.exports = async (page) => {

  const SIGNIN_PAGE             = 'https://instagram.com/accounts/login/';
  const SELECTOR_USERNAME_FIELD = 'input[name="username"]';
  const SELECTOR_PASSWORD_FIELD = 'input[name="password"]';
  const SELECTOR_SUBMIT_BUTTON  = 'button[type="submit"]';
  const SELECTOR_CHECK_AUTH     = '.glyphsSpriteUser__outline__24__grey_9.u-__7';
  const REQUEST_SIGNIN_URL      = 'https://www.instagram.com/accounts/login/ajax/';
  const PAGE_CHECK_AUTH         = 'https://instagram.com';

  log.header('Начинаю авторизацию...');
  await page.goto(SIGNIN_PAGE);

  log.info('Ожидание, пока отрисуеются поля формы авторизации');

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

  await page.click(SELECTOR_SUBMIT_BUTTON)
    .then(() => {
      log.success('Поля заполнены, отправка формы');
    })
    .catch(() => {
      log.error('Произошла ошибка отправки формы авторизации');
    });

  await page.waitForResponse(REQUEST_SIGNIN_URL);

  await page.goto(PAGE_CHECK_AUTH)
    .then(() => {
      log.success(`Открытие "${PAGE_CHECK_AUTH}" для проверки авторизации`);
    })
    .catch(() => {
      log.error(`Не удалось открыть "${PAGE_CHECK_AUTH}"`);
    });

  await page.mainFrame().waitForSelector(SELECTOR_CHECK_AUTH)
    .then(() => {
      log.success(`Ожидание появление в DOM дереве элемента с селектором: "${SELECTOR_CHECK_AUTH}"`);
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
