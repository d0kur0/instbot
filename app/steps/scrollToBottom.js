import browserInstance from "../browserInstance.js";

const scrollToBottom = async () => {
  await browserInstance.page.$eval("html", () => window.scrollTo(0, document.body.scrollHeight));
};

export default scrollToBottom;
