const log = require('./consoleLog.js');

module.exports = async (page) => {
  await page.mainFrame().waitForSelector('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-')
    .then(() => {
      log.info('Button like successfully rendered');
    })
    .catch(() => {
      log.error('The like button was not render');
    });

  let isExists = await page.$eval('.dCJp8.afkep.coreSpriteHeartOpen._0mzm- > span', el => el.classList.contains('glyphsSpriteHeart__filled__24__red_5'));

  if (!isExists) {
    await page.click('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-')
      .then(() => {
        log.success('Like successfully put');
      })
      .catch(() => {
        log.error('Failed to like');
      });
  } else {
    log.info('Like already worth, skip');
  }
};
