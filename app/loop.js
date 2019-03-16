const sleep        = require('./app/modules/sleep');
const log          = require('./app/modules/consoleLog');
const setLike      = require('./app/modules/setLike');
const cleanPost    = require('./app/modules/cleanPost');
const hashTagState = require('./app/modules/hashTagState');
const botSettings  = require('./app/configs/botSettings');

module.exports = async (options, page) => {

  const SELECTOR_POPULAR_POSTS = '.EZdmt';
  const SELECTOR_OPEN_POST     = '.v1Nh3.kIKUG._bz0w > a';

  const openHashTag = async (hashTag) => {
    await page.goto(`https://www.instagram.com/explore/tags/${hashTag}`)
        .then(() => {
          log.header('Открытие страницы хештега');
        })
        .catch(() => {
          log.error('Не удалось открыть страницу хештега');
        });

    await page.mainFrame().waitForSelector(SELECTOR_POPULAR_POSTS)
        .then(() => {
          log.success('Посты успешно отрендерились');
        })
        .catch(() => {
          log.error('Рендеринг постов завершился ошибкой');
        });

    await page.evaluate((isRemovePopular, SELECTOR_POPULAR_POSTS) => {
      if (isRemovePopular) {
        document.querySelector(SELECTOR_POPULAR_POSTS).remove();
      }}, botSettings.isRemovePopular, SELECTOR_POPULAR_POSTS);
  };
  const recursionLoop = async () => {

    await page.mainFrame().waitForSelector(SELECTOR_OPEN_POST)
      .then(() => {
        log.success('Кнопка открытия поп-ап поста успешно отрендерена');
      })
      .catch(() => {
        log.error('Кнопка открытия поп-ап поста не была отрендерена');
      });

    let postCount = await page.$$(SELECTOR_OPEN_POST);
    let iteration = 0;
    postCount = postCount.length;

    while (true) {
      log.header(`Начало итерации: #${iteration}`);

      try {
        await page.$eval(SELECTOR_OPEN_POST, el => el.click())
          .then(() => {
            log.success(`Поп-ап поста успешно открыт (#${iteration})`);
          })
          .catch(() => {
            log.error(`Не удалось открыть поп-ап поста (#${iteration})`);
          });

        if (await setLike(page)) {
          await sleep(botSettings.delayBeforeLike);

          if (botSettings.isSubscribe) {
            const setSubscribe = require('./app/modules/setSubscribe');
            await setSubscribe(page);
          }

          if (botSettings.isComment) {
            const setComment = require('./app/modules/setComment');
            await setComment(page);
            await sleep(options.bot.delayBeforeComment);
          }
        } else {
          log.error('Лайк уже стоит, пропускаю подписку и написание комментария');
        }

        await cleanPost(page);
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
          break;
        }
      } catch (Exception) {
        log.error(Exception);
        await cleanPost(page);
        continue;
      }
    }
  };
  const mainProcess = async () => {

  };

  await recursionLoop();

  return true;
};
