const sleep = require('./sleep.js');
const log = require('./consoleLog.js');
const setLike = require('./setLike');
const subscribe = require('./subscribe.js');
const setComment = require('./setComment.js');
const closeRemove = require('./closeRemove.js');

module.exports = async (options, page) => {
  await page.goto(options.hashTagUri)
    .then(() => {
      log.header('Открытие страницы хештега');
    })
    .catch(() => {
      log.error('Не удалось открыть страницу хештега');
    });

  await page.mainFrame().waitForSelector('.EZdmt')
    .then(() => {
      log.success('Посты успешно отрендерились');
    })
    .catch(() => {
      log.error('Рендеринг постов завершился ошибкой');
    });

  const renderResponse = await page.evaluate((removePopular) => {
    if (removePopular) {
      document.querySelector('.EZdmt').remove();
    }

    return Boolean(document.querySelectorAll('.v1Nh3.kIKUG._bz0w').length);
  }, options.bot.removePopular);

  if (!renderResponse) {
    log.error('Не удалось найти посты в DOM');
    return false;
  }

  let recursionLoop = async () => {

    await page.mainFrame().waitForSelector('.v1Nh3.kIKUG._bz0w > a')
      .then(() => {
        log.success('Кнопка открытия поп-ап поста успешно отрендерена');
      })
      .catch(() => {
        log.error('Кнопка открытия поп-ап поста не была отрендерена');
      });

    let postCount = await page.$$('.v1Nh3.kIKUG._bz0w > a');
    postCount = postCount.length;

    let iteration = 0;
    while (postCount > 0) {
      log.header(`Начало итерации: #${iteration}`);
      try {
        await page.$eval('.v1Nh3.kIKUG._bz0w > a', el => el.click())
          .then(() => {
            log.success(`Поп-ап поста успешно открыт (#${iteration})`);
          })
          .catch(() => {
            log.error(`Не удалось открыть поп-ап поста (#${iteration})`);
          });

        if (options.bot.setLike) {
          if (await setLike(page)) {
            await sleep(options.bot.delayBeforeLike);

            if (options.bot.subscribe) {
              await subscribe(page, options);
            }

            if (options.bot.setComment) {
              await setComment(page);
              await sleep(options.bot.delayBeforeComment);
            }
          } else {
            log.error('Лайк уже стоит, пропускаю подписку и написание комментария');
          }
        }

        await closeRemove(page);
        await sleep(options.bot.delayBeforeIteration);

        iteration++;

        if (postCount === iteration) {
          await page.$eval('html', () => window.scrollTo(0, document.body.scrollHeight))
            .then(async () => {
              log.header('Цикл завершился, скролл страницы вниз для загрузки новых постов');
            })
            .catch(() => {
              log.error('Не удалось проскроллить страницу для получения новых постов');
            });


          await recursionLoop();
          postCount = 0;
          break;
        }
      } catch (Exception) {
        log.error(Exception);
        await closeRemove(page);
        continue;
      }
    }
  };

  await recursionLoop();

  return true;
};
