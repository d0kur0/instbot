const puppeteer = require('puppeteer');

const hashTagUri = 'https://www.instagram.com/';
const username = '89818324892';
const password = 'popkaass99';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(hashTagUri);

  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  await page.screenshot({path: 'example.png'});

  console.log('Dimensions:', dimensions);

  await browser.close();
})();
