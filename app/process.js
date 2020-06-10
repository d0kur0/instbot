global._app = `${__dirname}`;

const puppeteer = require("puppeteer");
const browserSettings = require(`${_app}/configs/browserSettings`);
const auth = require(`${_app}/modules/auth`);
const loop = require(`${_app}/loop.js`);
const path = require("path");

global._dbPath = path.join(__dirname, "./limits.json");

(async () => {
  const browser = await puppeteer.launch(browserSettings);
  const page = await browser.newPage();

  if (!(await auth(page))) {
    return await browser.close();
  }

  if (!(await loop(page))) {
    return await browser.close();
  }
})();
