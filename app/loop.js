const sleep = require('./sleep.js');
const chalk = require('chalk');

module.exports = async (options, page) => {
  console.log(chalk.green(`\r\n➣ Открываю страницу постов хештега...`));
  await page.goto(options.hashTagUri);
  await sleep(500);

  console.log(chalk.green(`  ∟ Жду появления в DOM дереве селектора .EZdmt`));
  await page.mainFrame().waitForSelector('.EZdmt')
      .then(() => console.log(chalk.blue(`  ∟ Селектор найден`)));

  const renderResponse = await page.evaluate((removePopular) => {
    let posts = document.querySelectorAll('.v1Nh3.kIKUG._bz0w');

    if (removePopular) {
      document.querySelector('.EZdmt').remove();
    }

    return Boolean(posts.length);
  }, options.bot.removePopular);

  if (!renderResponse) {
    console.log(chalk.red(`  ∟ Не смог найти ни одного поста ⚝ `));
    return false;
  }

  console.log(chalk.green(`  ∟ Посты хештега успешно отрендерились`));

  if (options.bot.removePopular) {
    console.log(chalk.green(`  ∟ Удалил раздел популярных постов`));
  }

  let recursionLoop = async () => {
    console.log(chalk.green(`  ∟ Жду появления в DOM дереве селектора .v1Nh3.kIKUG._bz0w > a`));
    await page.mainFrame().waitForSelector('.v1Nh3.kIKUG._bz0w > a')
        .then(() => console.log(chalk.blue(`  ∟ Селектор найден ⚝ `)))
        .catch(() => console.log(chalk.red(`  ∟ Не смог найти селектор`)));

    let postCount = await page.$$('.v1Nh3.kIKUG._bz0w > a');
    let iteration = 0;
    postCount = postCount.length;

    while (postCount >= 0) {
      console.log(chalk.green(`  ∟ Жду открытия окна фото`));
      await page.$eval('.v1Nh3.kIKUG._bz0w > a', el => el.click())
          .then(() => console.log(chalk.blue(`  ∟ Успешно открыто ⚝ `)))
          .catch(() => console.log(chalk.red(`  ∟ Не смог открыть`)));;

      /**
       * setLike
       */
      if (options.bot.setLike) {
        console.log(chalk.green(`  ∟ Жду появления в DOM дереве кнопки лайка`));
        await page.mainFrame().waitForSelector('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-')
            .then(() => console.log(chalk.blue(`  ∟ Успешно нашёл, ставлю лайк ⚝ `)))
            .catch(() => console.log(chalk.red(`  ∟ Не смог найти`)));

        let likeResult = await page.$eval('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-', (el) => {
          let child = el.childNodes[0];

          if (!child.classList.contains('glyphsSpriteHeart__filled__24__red_5')) {
            el.click();
            return true;
          } else {
            return false;
          }
        });

        if (likeResult) {
          console.log(chalk.blue.bold(`  ∟ Лайк успешно поставлен`));
        } else {
          console.log(chalk.blue.bold(`  ∟ Лайк уже стоит, иду дальше`));
        }
      }

      /**
       * Subscribe
       */
      if (options.bot.subscribe) {
        try {
          console.log(chalk.green(`  ∟ Жду появления в DOM дереве кнопки подписки`));
          await page.mainFrame().waitForSelector('.oW_lN._0mzm-.sqdOP.yWX7d')
              .then(() => console.log(chalk.blue(`  ∟ Успешно нашёл, подписываюсь`)))
              .catch(() => console.log(chalk.red(`  ∟ Не смог найти`)));

          let subsResult = await page.$eval('.oW_lN._0mzm-.sqdOP.yWX7d', (el) => {
            el.click();

            return true;
          });

          if (subsResult) {
            console.log(chalk.blue.bold(`  ∟ Успешно подписался ⚝ `));
          } else {
            console.log(chalk.blue.bold(`  ∟ Не удалось подписаться`));
          }

        } catch (exception) {
          continue;
        }
      }

      console.log(chalk.green(`  ∟ Жду появления в DOM кнопки закрытия окна`));
      await page.mainFrame().waitForSelector('button.ckWGn')
          .then(() => console.log(chalk.blue(`  ∟ Успешно нашёл, закрываю`)))
          .catch(() => console.log(chalk.red(`  ∟ Не смог найти`)));;

      await page.click('button.ckWGn');

      console.log(chalk.green(`  ∟ Удаляю обработанный элемент из DOM`));
      await page.$eval('.v1Nh3.kIKUG._bz0w > a', el => el.remove())
          .then(() => console.log(chalk.blue(`  ∟ Успешно удалил, иду дальше ⚝ `)))
          .catch(() => console.log(chalk.red(`  ∟ Не смог удалить`)));;

      await sleep(options.bot.delay);

      iteration++;

      if (postCount === iteration) {
        console.log(chalk.green(`  ∟ Гружу новые посты`));
        await page.$eval('html', el => window.scrollTo(0, document.body.scrollHeight));
        await recursionLoop();
      }
    }

  };

  await recursionLoop();

  return true;
};
