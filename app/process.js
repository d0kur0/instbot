const puppeteer = require('puppeteer');
const options = require('./options.js');
const auth = require('./auth.js');
const loop = require('./loop.js');

(async () => {
  const browser = await puppeteer.launch(options.browserOptions);
  const page = await browser.newPage();
  const authResponse = await auth(page, options.authData);

  if (!authResponse) {
    return await browser.close();
  }

  const loopResponse = await loop(options, page);

  if (!loopResponse) {
    return await browser.close();
  }
})();
