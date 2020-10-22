import limitsManager from "../utils/limitsManager.js";
import { writeInfo, writeSuccess } from "../utils/logger.js";
import { SELECTOR_BUTTON_SUBSCRIBE, SELECTOR_CHECK_SUBSCRIBE } from "../assets/selectors.js";
import browserInstance from "../browserInstance.js";
import settings from "../settings.json";
import sleep from "../utils/sleep.js";

const clickSubscribe = async () => {
  if (!settings.bot.isClickSubscribe) {
    return await writeInfo("Подписки выключены в конфигурации, пропускаем операцию");
  }

  if (await limitsManager.isLimitsReached("subscribes")) {
    return await writeInfo("Лимит подписок на сегодня исчерпан, пропускаем операцию");
  }

  const isSubscribeExists = !(await browserInstance.page.$(SELECTOR_CHECK_SUBSCRIBE));
  if (isSubscribeExists) {
    return await writeInfo("Подписка на автора поста уже есть, пропускаем операцию");
  }

  await writeInfo("Кликаем на кнопку подписки");
  await browserInstance.page.click(SELECTOR_BUTTON_SUBSCRIBE);
  await writeSuccess("Подписка нажата");

  await limitsManager.increment("subscribes");
  await sleep(settings.delays.afterClickSubscribe);
};

export default clickSubscribe;
