const log = require(`${_app}/modules/consoleLog`);

module.exports = async page => {
  const SELECTOR_CLOSE_POPUP =
    "body > div._2dDPU.CkGkG > div.Igw0E.IwRSH.eGOV_._4EzTm.BI4qX.qJPeX.fm1AK.TxciK.yiMZG > button";
  const SELECTOR_REMOVE_POST = ".Nnq7C.weEfm > .v1Nh3.kIKUG._bz0w";

  await page
    .mainFrame()
    .waitForSelector(SELECTOR_CLOSE_POPUP)
    .then(() => {
      log.info("Найдена кнопка закрытия поп-ап поста");
    })
    .catch(() => {
      log.error("Не удалось найти кнопку закрытия поп-ап поста");
    });

  await page
    .click(SELECTOR_CLOSE_POPUP)
    .then(() => {
      log.success("Поп-ап поста успешно закрыт");
    })
    .catch(() => {
      log.error("Не удалось закрыть поп-ап поста");
    });

  await page
    .$eval(SELECTOR_REMOVE_POST, el => el.remove())
    .then(() => {
      log.success("Элемент поста успешно удалён из DOM");
    })
    .catch(() => {
      log.error("Не удалось удалить элемент поста из DOM");
    });
};
