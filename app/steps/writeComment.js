import limitsManager from "../utils/limitsManager.js";
import { writeInfo } from "../utils/logger.js";
import browserInstance from "../browserInstance.js";
import { SELECTOR_COMMENT_FIELD } from "../assets/selectors.js";
import settings from "../settings.json";
import { PendingXHR } from "pending-xhr-puppeteer";
import sample from "lodash.sample";
import sleep from "../utils/sleep.js";

const writeComment = async () => {
  if (!settings.bot.isWriteComment) {
    return await writeInfo("Комментарии выключены в конфигурации, пропускаем операцию");
  }

  if (await limitsManager.isLimitsReached("comments")) {
    return await writeInfo("Лимит комментариев на сегодня исчерпан, пропускаем операцию");
  }

  await writeInfo("Ожидание появления поля ввода комментария");
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_COMMENT_FIELD);
  await writeInfo("Пишем комментарий");

  const randomComment = sample(settings.commentsList);
  await browserInstance.page.focus(SELECTOR_COMMENT_FIELD);
  await browserInstance.page.keyboard.type(randomComment);

  const requestWaiter = new PendingXHR(browserInstance.page);
  await writeInfo("Отправка комментария");
  await browserInstance.page.keyboard.press("Enter");
  await requestWaiter.waitForAllXhrFinished();
  await writeInfo("Комментарий отправлен");

  await limitsManager.increment("comments");
  await sleep(settings.delays.afterWriteComment);
};

export default writeComment;
