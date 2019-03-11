const sleep = require('./sleep.js');
const chalk = require('chalk');

module.exports = async (page, authData) => {

  console.log(chalk.green(`➣ Начинаю авторизацию ...`));

  await page.goto('https://instagram.com/accounts/login/');
  await sleep(1000);

  console.log(chalk.green(`  ∟ Эмулирую ввод данных и пытаюсь зайти`));
  await page.focus('input[name="username"]');
  await page.keyboard.type(authData.username);

  await page.focus('input[name="password"]');
  await page.keyboard.type(authData.password);

  await page.click('button[type="submit"]');

  console.log(chalk.green(`  ∟ Запрос прошёл, проверяю залогинен ли`));

  await sleep(1000);
  await page.goto('https://instagram.com');

  const authResponse = await page.evaluate(() => {
    let issetNotificationButton = document.querySelector('div.mt3GC > button.aOOlW.HoLwm');

    if (issetNotificationButton !== null) {
      return true;
    } else {
      return false;
    }
  });

  if (!authResponse) {
    console.log(chalk.red(`  ∟ Кажется авторизация не удалась, что-то пошло не так ⚝`));
    return false;
  }

  console.log(chalk.green.bold(`  ∟ Успешно авторизовались ❤`));
  return true;
};
