import browserInstance from "../browserInstance.js";
import { writeInfo, writeSuccess } from "../utils/logger.js";
import { SELECTOR_POPULAR_POSTS } from "../assets/selectors.js";
import settings from "../settings.json";

const openSource = async source => {
  await writeInfo(`Открытие источника: ${source}`);
  await browserInstance.page.goto(`https://www.instagram.com/explore/${source}`);
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_POPULAR_POSTS);

  if (settings.bot.isRemovePopular) {
    await writeInfo(`Удаление раздела "популярное"`);
    await browserInstance.page.evaluate(
      selector => document.querySelector(selector).remove(),
      SELECTOR_POPULAR_POSTS
    );
  }

  await writeSuccess(`Источник ${source} открыт`);
};

export default openSource;
