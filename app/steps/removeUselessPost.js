import browserInstance from "../browserInstance.js";
import { SELECTOR_CLOSE_POPUP, SELECTOR_REMOVE_POST } from "../assets/selectors.js";
import { writeInfo } from "../utils/logger.js";

const removeUselessPost = async () => {
  await writeInfo("Закрытие поста и удаление из DOM");
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_CLOSE_POPUP);
  await browserInstance.page.click(SELECTOR_CLOSE_POPUP);
  await browserInstance.page.$eval(SELECTOR_REMOVE_POST, e => e.remove());
};

export default removeUselessPost;
