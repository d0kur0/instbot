const puppeteer = require('puppeteer');
const options = require('./options.js');
const auth = require('./auth.js');
const loop = require('./loop.js');

(async () => {
  const browser = await puppeteer.launch(options.browserOptions);
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

  const authResponse = await auth(page, options.authData);

  if (!authResponse) {
    return await browser.close();
  }

  const loopResponse = await loop(options, page);

  if (!loopResponse) {
    return await browser.close();
  }
})();
