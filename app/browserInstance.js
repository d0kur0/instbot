import puppeteer from "puppeteer";
import settings from "./settings.json";

const makeInstance = async () => {
  const self = await puppeteer.launch(settings.browser);
  const page = await self.newPage();

  return { self, page };
};

export default await makeInstance();
