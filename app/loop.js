const sleep = require('./sleep.js');
const chalk = require('chalk');

module.exports = async (options, page) => {
  console.log(chalk.green(`\r\n➣ Открываю страницу постов хештега...`));
  await page.goto(options.hashTagUri);
  await sleep(700);

  const renderResponse = await page.evaluate((removePopular) => {
    let posts = document.querySelectorAll('.v1Nh3.kIKUG._bz0w');

    if (removePopular) {
      document.querySelector('.EZdmt').remove();
    }

    return Boolean(posts.length);
  }, options.bot.removePopular);

  if (!renderResponse) {
    console.log(chalk.red(`  ∟ Не смог найти ни одного поста ⚝`));
    return false;
  }

  console.log(chalk.green(`  ∟ Посты хештега успешно отрендерились`));

  if (options.bot.removePopular) {
    console.log(chalk.green(`  ∟ Удалил раздел популярных постов`));
  }

  let recursionLoop = async () => {
    const posts = await page.$$('.v1Nh3.kIKUG._bz0w');
    const handleNode = async (post) => {
      return posts[post].$eval('a', (el, subscribe) => {
        let sleep = function (ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

        let handlePost = async () => {
          el.click();
          await sleep(500);

          let likeBtn = document.querySelector('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-');

          if (!likeBtn) {
            return -1;
          }

          let likeChild = likeBtn.childNodes[0];

          if (!likeChild.classList.contains('glyphsSpriteHeart__filled__24__red_5')) {
            likeBtn.click();
            await sleep(600);
          }

          if (subscribe) {
            let subsBtn = document.querySelector('.oW_lN._0mzm-.sqdOP.yWX7d');

            if (!subsBtn) {
              return -2;
            }

            if (!subsBtn.classList.contains('_8A5w5')) {
              subsBtn.click();
              await sleep(600);
            }
          }

          let closeBtn = document.querySelector('.ckWGn');

          if (!closeBtn) {
            return -3;
          }

          closeBtn.click();
          el.remove();

          return 1;
        };

        return (async () => await handlePost())();
      }, options.bot.subscribe);
    };

    for (post in posts) {
      console.log(chalk.green(`  ∟ Начинаю обрабатывать пост`));
      let result = await handleNode(post);

      switch (result) {
        case 1:
          console.log(chalk.blue(`  ∟ Пост успешно обработан`));
          break;

        case -1:
          console.log(chalk.red(`  ∟ Не смог найти кнопку лайка ⚝`));
          break;

        case -2:
          console.log(chalk.red(`  ∟ Не смог найти кнопку подписки ⚝`));
          break;

        case -3:
          console.log(chalk.red(`  ∟ Не смог найти кнопку закрытия фото ⚝`));
          break;
      }

      await sleep(3000);
    }
  };

  await recursionLoop();

  return true;
};
