import browserInstance from "../browserInstance.js";
import { SELECTOR_SUSPEND_SIGN_IN } from "../assets/selectors.js";

const isExistSuspendWindow = async () => {
  return await browserInstance.page.evaluate(
    selector => Boolean(document.querySelector(selector)),
    SELECTOR_SUSPEND_SIGN_IN
  );
};

export default isExistSuspendWindow;
