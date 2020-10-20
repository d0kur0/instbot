import browserInstance from "../browserInstance.js";
import { SELECTOR_OPEN_POST } from "../assets/selectors.js";
import { writeInfo } from "../utils/logger.js";

const openPost = async () => {
  await writeInfo("Открытие поста");
  await browserInstance.page.$eval(SELECTOR_OPEN_POST, el => el.click());
};

export default openPost;
