const sleep = require('./sleep.js');
const log = require('./consoleLog.js');
const setLike = require('./setLike');
const subscribe = require('./subscribe.js');
const setComment = require('./setComment.js');

module.exports = async (options, page) => {
  await page.goto(options.hashTagUri)
    .then(() => {
      log.header('The opening page of the hashtag posts');
    })
    .catch(() => {
      log.error('Failed to load hashtag page');
    });

  await page.mainFrame().waitForSelector('.EZdmt')
    .then(() => {
      log.success('Posts successfully rendered');
    })
    .catch(() => {
      log.error('Posts could not rendered');
    });

  const renderResponse = await page.evaluate((removePopular) => {
    if (removePopular) {
      document.querySelector('.EZdmt').remove();
    }

    return Boolean(document.querySelectorAll('.v1Nh3.kIKUG._bz0w').length);
  }, options.bot.removePopular);

  if (!renderResponse) {
    log.error('No posts found in DOM');
    return false;
  }

  let recursionLoop = async () => {

    await page.mainFrame().waitForSelector('.v1Nh3.kIKUG._bz0w > a')
      .then(() => {
        log.info('Photos were rendering');
      })
      .catch(() => {
        log.error('Not a single photo doesn\'t render');
      });

    let postCount = await page.$$('.v1Nh3.kIKUG._bz0w > a');
    postCount = postCount.length;

    let iteration = 0;
    while (postCount >= 0) {
      await page.$eval('.v1Nh3.kIKUG._bz0w > a', el => el.click())
        .then(() => {
          log.success(`Successfully opened the photo (#${iteration})`);
        })
        .catch(() => {
          log.error(`Couldn't open the photo (#${iteration})`);
        });

      if (options.bot.setLike) {
        setLike(page);
      }

      await sleep(options.bot.delayBeforeLike);

      if (options.bot.subscribe) {
        subscribe(page);
      }

      await sleep(options.bot.delayBeforeSubscribe);

      if (options.bot.setComment) {
        setComment(page);
      }

      await sleep(100000000000);

      await sleep(options.bot.delayBeforeComment);

      await page.mainFrame().waitForSelector('button.ckWGn')
        .then(() => {
          log.info('Found the button to close the photo window');
        })
        .catch(() => {
          log.error('Photo window close button not found');
        });

      await page.click('button.ckWGn')
        .then(() => {
          log.success('Successfully closed the window photo');
        })
        .catch(() => {
          log.error('Failed to close photo window');
        });

      await page.$eval('.v1Nh3.kIKUG._bz0w > a', el => el.remove())
        .then(() => {
          log.success('Successfully deleted the photo element from the DOM');
        })
        .catch(() => {
          log.error('Unable to remove item from DOM');
        });

      await sleep(options.bot.beforeIterationDelay);

      iteration++;

      if (postCount === iteration) {
        await page.$eval('html', () => window.scrollTo(0, document.body.scrollHeight))
          .then(async () => {
            log.success('The cycle is over, start a new one');
          })
          .catch(() => {
            log.error('Failed to scroll page, new posts not received');
          });


        await recursionLoop();
      }
    }
  };

  await recursionLoop();

  return true;
};
