const log = require('./consoleLog.js');
const chalk = require('chalk');

module.exports = async (page, authData) => {

  log.header('Beginning authorization');
  await page.goto('https://instagram.com/accounts/login/');

  log.info('Waiting for the user name input field to be rendered');

  // Await username field and filling
  await page.mainFrame().waitForSelector('input[name="username"]')
    .then(async () => {
      log.info('Field enter the name of the user is drawn, filling');

      await page.focus('input[name="username"]');
      await page.keyboard.type(authData.username);
    })
    .catch(() => {
      log.error('Field enter the name of the user is drawn, filling');
    });

  // Await password field and filling
  await page.mainFrame().waitForSelector('input[name="password"]')
    .then(async () => {
      log.success('Field enter the password of the user is drawn, filling');

      await page.focus('input[name="password"]');
      await page.keyboard.type(authData.password);
    })
    .catch(() => {
      log.error('Password input field is not render');
    });

  await page.click('button[type="submit"]')
    .then(() => {
      log.success('User data entry fields are filled in, emulating sending the form');
    })
    .catch(() => {
      log.error('Error sending authorization form');
    });

  // Await auth request
  await page.waitForResponse('https://www.instagram.com/accounts/login/ajax/');

  await page.goto('https://instagram.com')
    .then(() => {
      log.success('Open instagram.com to check authorization');
    })
    .catch(() => {
      log.error('Could not open instagram.com');
    });

  await page.mainFrame().waitForSelector('div.mt3GC > button.aOOlW.HoLwm')
    .then(() => {
      log.success('The selector div.mt3GC > button.aOOlW.HoLwm appeared in DOM');
    })
    .catch(() => {
      log.error('Failed to find the selector div.mt3GC > button.aOOlW.HoLwm in DOM');
    });

  const authResponse = await page.evaluate(() => Boolean(document.querySelector('div.mt3GC > button.aOOlW.HoLwm')));

  if (!authResponse) {
    log.error('Authorization failed, something went wrong')
    return false;
  }

  log.success('Successfully logged in ❤');
  return true;
};
