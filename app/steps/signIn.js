import { writeInfo, writeSuccess, writeTitle } from "../utils/logger.js";
import settings from "../settings.json";
import { PendingXHR } from "pending-xhr-puppeteer";
import browserInstance from "../browserInstance.js";
import {
  SELECTOR_CANCEL_NOTIFICATIONS_BUTTON,
  SELECTOR_CHECK_AUTH,
  SELECTOR_PASSWORD_FIELD,
  SELECTOR_SAVE_AUTH,
  SELECTOR_SUBMIT_AUTH_BUTTON,
  SELECTOR_USERNAME_FIELD,
} from "../assets/selectors.js";

const singInURL = "https://www.instagram.com/accounts/login/";

const auth = async () => {
  await browserInstance.page.goto(singInURL);
  await writeTitle("Авторизация");

  await writeInfo("Ожидание отрисовки полей авторизации");
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_USERNAME_FIELD);
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_PASSWORD_FIELD);

  await writeInfo("Заполнение полей авторизации");
  await browserInstance.page.type(SELECTOR_USERNAME_FIELD, settings.auth.username);
  await browserInstance.page.type(SELECTOR_PASSWORD_FIELD, settings.auth.password);

  await writeInfo("Поля заполнены, клик кнопки входа");
  const requestWaiter = new PendingXHR(browserInstance.page);
  await browserInstance.page.click(SELECTOR_SUBMIT_AUTH_BUTTON);
  await requestWaiter.waitForAllXhrFinished();

  await writeTitle("Проверка авторизации");
  await browserInstance.page.waitForNavigation();

  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_SAVE_AUTH);
  const isExistsSaveAuthRequest = await browserInstance.page.evaluate(
    selector => Boolean(document.querySelector(selector)),
    SELECTOR_SAVE_AUTH
  );

  if (isExistsSaveAuthRequest) {
    await writeInfo("Получен запрос на сохранение сессии, отклонение");
    await browserInstance.page.click(SELECTOR_SAVE_AUTH);
  }

  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_CANCEL_NOTIFICATIONS_BUTTON);
  const isExistsNotificationsRequest = await browserInstance.page.evaluate(
    selector => Boolean(document.querySelector(selector)),
    SELECTOR_CANCEL_NOTIFICATIONS_BUTTON
  );

  if (isExistsNotificationsRequest) {
    await writeInfo("Получен запрос на отправку оповещений, отклоняем");
    await browserInstance.page.click(SELECTOR_CANCEL_NOTIFICATIONS_BUTTON);
  }

  await writeInfo(`Ожидание появление в DOM дереве элемента с селектором: "${SELECTOR_CHECK_AUTH}"`);
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_CHECK_AUTH);
  const isExistsOnlyAuthElement = await browserInstance.page.evaluate(
    selector => Boolean(document.querySelector(selector)),
    SELECTOR_CHECK_AUTH
  );

  if (!isExistsOnlyAuthElement) {
    throw new Error(`Авторизация не удалась, элемент не найден: ${SELECTOR_CHECK_AUTH}`);
  }

  await writeSuccess("Авторизация прошла успешно ❤");
};

export default auth;
