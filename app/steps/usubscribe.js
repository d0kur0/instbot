import browserInstance from "../browserInstance.js";
import {
  SELECTOR_SUBSCRIBES_CANCEL_BUTTON,
  SELECTOR_SUBSCRIBES_ITEM_BUTTON,
  SELECTOR_SUBSCRIBES_LIST_ITEM,
} from "../assets/selectors.js";
import { writeInfo, writeSuccess } from "../utils/logger.js";
import limitsManager from "../utils/limitsManager.js";

const unsubscribe = async () => {
  await writeInfo("Эмуляция клика по отписке");
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_SUBSCRIBES_ITEM_BUTTON);
  await browserInstance.page.click(SELECTOR_SUBSCRIBES_ITEM_BUTTON);
  await browserInstance.page
    .mainFrame()
    .waitForSelector(SELECTOR_SUBSCRIBES_CANCEL_BUTTON);
  await browserInstance.page.click(SELECTOR_SUBSCRIBES_CANCEL_BUTTON);
  await writeSuccess("Успешно отписались");
  await writeInfo("Удаление элемента списка, с которого отписались");
  await browserInstance.page.evaluate(selector => {
    const firstListItem = document.querySelector(selector);
    firstListItem && firstListItem.remove();
  }, SELECTOR_SUBSCRIBES_LIST_ITEM);
  await writeSuccess("Элемент удалён");
  await limitsManager.increment("unsubscribes");
};

export default unsubscribe;
