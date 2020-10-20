import { writeInfo, writeSuccess } from "../utils/logger.js";
import browserInstance from "../browserInstance.js";
import { SELECTOR_LIKE_BUTTON, SELECTOR_LIKE_BUTTON_CHILD } from "../assets/selectors.js";
import limitsManager from "../utils/limitsManager.js";
import settings from "../settings.json";

const clickLike = async () => {
  if (await limitsManager.isLimitsReached("likes")) {
    return await writeInfo("Лимит лайков на сегодня исчерпан, пропускаем операцию");
  }

  await writeInfo("Ожидание появления кнопки лайка");
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_LIKE_BUTTON);

  const isLikeExists = await browserInstance.page.evaluate(selector => {
    const svgElement = document.querySelector(selector);
    if (!svgElement) return false;
    return svgElement.getAttribute("fill") === "#ed4956";
  }, SELECTOR_LIKE_BUTTON_CHILD);

  isLikeExists || browserInstance.page.click(SELECTOR_LIKE_BUTTON);
  isLikeExists ? await writeInfo("Лайк уже стоит, пропускаем") : await writeSuccess("Лайк успешно поставлен");

  await limitsManager.increment("likes");
};

export default clickLike;
