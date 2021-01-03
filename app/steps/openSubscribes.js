import browserInstance from "../browserInstance.js";
import { SELECTOR_OPEN_SUBSCRIBES } from "../assets/selectors.js";
import { writeInfo, writeSuccess } from "../utils/logger.js";

const openSubscribes = async () => {
  await writeInfo("Открытие списка подписок");
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_OPEN_SUBSCRIBES);
  await browserInstance.page.click(SELECTOR_OPEN_SUBSCRIBES);
  await writeSuccess("Список подписок открыт");
};

export default openSubscribes;
