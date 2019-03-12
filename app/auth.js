const sleep = require('./sleep.js');
const chalk = require('chalk');

module.exports = async (page, authData) => {

  console.log(chalk.green(`➣ Beginning authorization ...`));
  await page.goto('https://instagram.com/accounts/login/');

  console.log(chalk.green(`  ∟ Waiting for the user name input field to be rendered`));

  // Await username field and filling
  await page.mainFrame().waitForSelector('input[name="username"]')
    .then(async () => {
      console.log(chalk.blue(`  ∟ Field enter the name of the user is drawn, filling ⚝ `));

      await page.focus('input[name="username"]');
      await page.keyboard.type(authData.username);
    })
    .catch(() => {
      console.log(chalk.red(`  ∟ User name input field is not render`))
    });

  // Await password field and filling
  await page.mainFrame().waitForSelector('input[name="password"]')
    .then(async () => {
      console.log(chalk.blue(`  ∟ Field enter the password of the user is drawn, filling ⚝ `));

      await page.focus('input[name="password"]');
      await page.keyboard.type(authData.password);
    })
    .catch(() => {
      console.log(chalk.red(`  ∟ Password input field is not render`))
    });

  await page.click('button[type="submit"]')
    .then(() => {
      console.log(chalk.green(`  ∟ User data entry fields are filled in, emulating sending the form`));
    })
    .catch(() => {
      console.log(chalk.red(`  ∟ Error sending authorization form`));
    });

  // Await auth request
  await page.waitForResponse('https://www.instagram.com/accounts/login/ajax/');

  await page.goto('https://instagram.com')
    .then(() => {
      console.log(chalk.green(`  ∟ Open instagram.com to check authorization`));
    })
    .catch(() => {
      console.log(chalk.red(`  ∟ Could not open instagram.com`));
    });

  await page.mainFrame().waitForSelector('div.mt3GC > button.aOOlW.HoLwm')
    .then(() => {
      console.log(chalk.green(`  ∟ The selector div.mt3GC > button.aOOlW.HoLwm appeared in DOM`));
    })
    .catch(() => {
      console.log(chalk.red(`  ∟ Failed to find the selector div.mt3GC > button.aOOlW.HoLwm in DOM`));
    });

  const authResponse = await page.evaluate(() => Boolean(document.querySelector('div.mt3GC > button.aOOlW.HoLwm')));

  if (!authResponse) {
    console.log(chalk.red(`  ∟ Authorization failed, something went wrong ⚝ `));
    return false;
  }

  console.log(chalk.green.bold(`  ∟ Successfully logged in ❤ `));
  return true;
};
