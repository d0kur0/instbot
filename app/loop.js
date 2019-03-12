const sleep = require('./sleep.js');
const chalk = require('chalk');
const setLike = require('./setLike');
const subscribe = require('./subscribe.js');

module.exports = async (options, page) => {
  console.log(chalk.green(`\r\n➣ The opening page of the hashtag posts...`));
  await page.goto(options.hashTagUri);

  console.log(chalk.green(`  ∟ Waiting for the render mesh posts`));
  await page.mainFrame().waitForSelector('.EZdmt')
    .then(() => {
      console.log(chalk.blue(`  ∟ Posts successfully rendered`))
    })
    .catch(() => {
      console.log(chalk.red(`  ∟ Posts could not rendered`))
    });

  const renderResponse = await page.evaluate((removePopular) => {
    if (removePopular) {
      document.querySelector('.EZdmt').remove();
    }

    return Boolean(document.querySelectorAll('.v1Nh3.kIKUG._bz0w').length);
  }, options.bot.removePopular);

  if (!renderResponse) {
    console.log(chalk.red(`  ∟ No posts found in DOM ⚝ `));
    return false;
  }

  let recursionLoop = async () => {

    await page.mainFrame().waitForSelector('.v1Nh3.kIKUG._bz0w > a')
      .then(() => {
        console.log(chalk.blue(`  ∟ Photos were rendering ⚝ `))
      })
      .catch(() => {
        console.log(chalk.red(`  ∟ Not a single photo doesn't render`))
      });

    let postCount = await page.$$('.v1Nh3.kIKUG._bz0w > a');
    postCount = postCount.length;

    let iteration = 0;
    while (postCount >= 0) {
      await page.$eval('.v1Nh3.kIKUG._bz0w > a', el => el.click())
        .then(() => {
          console.log(chalk.green(`  ∟ Successfully opened the photo (#${iteration}) ⚝ `))
        })
        .catch(() => {
          console.log(chalk.red(`  ∟ Couldn't open the photo (#${iteration})`))
        });

      if (options.bot.setLike) {
        setLike(page);
      }

      await sleep(options.bot.delayBeforeLike);

      if (options.bot.subscribe) {
        subscribe(page);
      }

      await sleep(options.bot.delayBeforeSubscribe);

      await page.mainFrame().waitForSelector('button.ckWGn')
        .then(() => {
          console.log(chalk.blue(`  ∟ Found the button to close the photo window`))
        })
        .catch(() => {
          console.log(chalk.red(`  ∟ Photo window close button not found`))
        });

      await page.click('button.ckWGn')
        .then(() => {
          console.log(chalk.green(`  ∟ Successfully closed the window photo`))
        })
        .catch(() => {
          console.log(chalk.red(`  ∟ Failed to close photo window`))
        });

      await page.$eval('.v1Nh3.kIKUG._bz0w > a', el => el.remove())
        .then(() => {
          console.log(chalk.green(`  ∟ Successfully deleted the photo element from the DOM ⚝ `))
        })
        .catch(() => {
          console.log(chalk.red(`  ∟ Unable to remove item from DOM`))
        });

      await sleep(options.bot.beforeIterationDelay);

      iteration++;

      if (postCount === iteration) {
        await page.$eval('html', () => window.scrollTo(0, document.body.scrollHeight))
          .then(async () => {
            console.log(chalk.green(`  ∟ The cycle is over, start a new one ⚝ `))
          })
          .catch(() => {
            console.log(chalk.red(`  ∟ Failed to scroll page, new posts not received`))
          });


        await recursionLoop();
      }
    }

  };

  await recursionLoop();

  return true;
};
