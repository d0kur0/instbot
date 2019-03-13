const log = require('./consoleLog.js');
const messages = require('./messages.js');

module.exports = async (page) => {
  await page.mainFrame().waitForSelector('textarea.Ypffh')
    .then(async () => {
      let message = messages[Math.floor(Math.random() * messages.length)];

      await page.focus('textarea.Ypffh');
      await page.keyboard.type(message)
        .then(() => {
          log.error('TYPE MESSAGE');
        });

      await page.keyboard.press('Enter');
      await page.waitForRequest(request => request.method() === 'POST');
    })
    .catch(() => {
      log.error('The input field of the comment is not found');
    });
};
