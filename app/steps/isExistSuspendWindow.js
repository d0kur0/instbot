import browserInstance from "../browserInstance.js";

const isExistSuspendWindow = async () => {
  const currentUrl = await browserInstance.page.url();
  return currentUrl.includes("instagram.com/challenge");
};

export default isExistSuspendWindow;
