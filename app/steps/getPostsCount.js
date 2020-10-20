import browserInstance from "../browserInstance.js";
import { SELECTOR_OPEN_POST } from "../assets/selectors.js";
import { writeInfo } from "../utils/logger.js";

const getPostsCount = async () => {
  await writeInfo("Получение количества постов");
  await browserInstance.page.mainFrame().waitForSelector(SELECTOR_OPEN_POST);

  return (await browserInstance.page.$$(SELECTOR_OPEN_POST)).length || 0;
};

export default getPostsCount;
