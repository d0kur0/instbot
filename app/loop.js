const sleep = require('./sleep.js');
const chalk = require('chalk');

module.exports = async (options, page) => {
  console.log(chalk.green(`\r\n➣ Открываю страницу постов хештега...`));
  await page.goto(options.hashTagUri);
  await sleep(1000);

  const renderResponse = await page.evaluate((removePopular) => {
    let posts = document.querySelectorAll('.v1Nh3.kIKUG._bz0w');

    if (removePopular) {
      document.querySelector('.EZdmt').remove();
    }

    return posts.length > 0 ? true : false;
  }, options.bot.removePopular);

  if (!renderResponse) {
    console.log(chalk.red(`  ∟ Не смог найти ниодного поста`));
    return false;
  }

  console.log(chalk.green(`  ∟ Посты хештега успешно отрендерились`));

  if (options.bot.removePopular) {
    console.log(chalk.green(`  ∟ Удалил раздел популярных постов`));
  }

  let recursionLoop = async () => {
    const posts = await page.$$('.v1Nh3.kIKUG._bz0w');
    const handleNode = async (post) => {
      posts[post].$eval('a', el => {
        let sleep = function (ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

        let handlePost = async () => {
          el.click();
          await.sleep();
        };

        (async () => { await handlePost(); })();
      });
    };

    for (post in posts) {
      console.log(chalk.green(`  ∟ Начинаю обрабатывать пост`));
      await handleNode(post);
      console.log(chalk.blue(`  ∟ Успешно обработал пост`));
      await sleep(10000);
    }
  };

  await recursionLoop();

  return true;
};
