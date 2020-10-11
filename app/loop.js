const sleep = require(`${_app}/modules/sleep`);
const log = require(`${_app}/modules/consoleLog`);
const setLike = require(`${_app}/modules/setLike`);
const cleanPost = require(`${_app}/modules/cleanPost`);
const timestamp = require(`${_app}/modules/getTimestamp`);
const setSubscribe = require(`${_app}/modules/setSubscribe`);
const setComment = require(`${_app}/modules/setComment`);
const botSettings = require(`${_app}/configs/botSettings`);
const hashTags = require(`${_app}/configs/hashTagsList`);

module.exports = async page => {
  const SELECTOR_POPULAR_POSTS = ".EZdmt";
  const SELECTOR_OPEN_POST = ".v1Nh3.kIKUG._bz0w > a";
  const INIT_TIMESTAMP = timestamp();

  const openHashTag = async hashTag => {
    await page
      .goto(`https://www.instagram.com/explore/${hashTag}`)
      .then(() => {
        log.header("Открытие страницы хештега");
      })
      .catch(() => {
        log.error("Не удалось открыть страницу хештега");
      });

    await page
      .mainFrame()
      .waitForSelector(SELECTOR_POPULAR_POSTS)
      .then(() => {
        log.success("Посты успешно отрендерились");
      })
      .catch(() => {
        log.error("Рендеринг постов завершился ошибкой");
      });

    await page.evaluate(
      (isRemovePopular, SELECTOR_POPULAR_POSTS) => {
        if (isRemovePopular) {
          document.querySelector(SELECTOR_POPULAR_POSTS).remove();
        }
      },
      botSettings.isRemovePopular,
      SELECTOR_POPULAR_POSTS
    );
  };

  await openHashTag(hashTags.getRandomTag());

  const recursionLoop = async () => {
    if (INIT_TIMESTAMP + botSettings.changeAfter < timestamp()) {
      await openHashTag(hashTags.getRandomTag())
        .then(() => log.success("Обновлён тег для работы"))
        .catch(() => log.error("Не удалось обновить тег"));
    }

    await page
      .mainFrame()
      .waitForSelector(SELECTOR_OPEN_POST)
      .then(() => {
        log.success("Кнопка открытия поп-ап поста успешно отрендерена");
      })
      .catch(() => {
        log.error("Кнопка открытия поп-ап поста не была отрендерена");
      });

    let postCount = await page.$$(SELECTOR_OPEN_POST);
    let iteration = 0;
    postCount = postCount.length;

    while (true) {
      log.header(`Начало итерации: #${iteration}`);

      try {
        await page
          .$eval(SELECTOR_OPEN_POST, el => el.click())
          .then(() => {
            log.success(`Поп-ап поста успешно открыт (#${iteration})`);
          })
          .catch(() => {
            log.error(`Не удалось открыть поп-ап поста (#${iteration})`);
          });

        if (await setLike(page)) {
          await sleep(botSettings.delayBeforeLike);

          if (botSettings.isSubscribe) {
            await setSubscribe(page);
          }

          if (botSettings.isComment) {
            await setComment(page);
            await sleep(botSettings.delayBeforeComment);
          }
        } else {
          log.error(
            "Лайк уже стоит, пропускаю подписку и написание комментария"
          );
        }

        await cleanPost(page);
        await sleep(botSettings.delayBeforeIteration);

        iteration++;

        if (postCount === iteration) {
          await page
            .$eval("html", () => window.scrollTo(0, document.body.scrollHeight))
            .then(async () => {
              log.header(
                "Цикл завершился, скролл страницы вниз для загрузки новых постов"
              );
            })
            .catch(() => {
              log.error(
                "Не удалось проскроллить страницу для получения новых постов"
              );
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

  await recursionLoop();

  return true;
};
