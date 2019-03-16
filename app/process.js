const puppeteer       = require('puppeteer');
const browserSettings = require('./app/configs/browserSettings');
const auth            = require('./app/modules/auth');

(async () => {
  const browser = await puppeteer.launch(browserSettings);
  const page    = await browser.newPage();

  if (!await auth(page)) {
    return await browser.close();
  }

  if (!await loop(page)) {
    return await browser.close();
  }
})();
