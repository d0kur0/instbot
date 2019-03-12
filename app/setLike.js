const chalk = require('chalk');

module.exports = async (page) => {
  await page.mainFrame().waitForSelector('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-')
    .then(() => {
      console.log(chalk.blue(`  ∟ Button like successfully rendered ⚝ `));
    })
    .catch(() => {
      console.log(chalk.red(`  ∟ The like button was not render`));
    });

  let isExists = await page.$eval('.dCJp8.afkep.coreSpriteHeartOpen._0mzm- > span', el => el.classList.contains('glyphsSpriteHeart__filled__24__red_5'));

  if (!isExists) {
    await page.click('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-')
      .then(() => {
        console.log(chalk.red(`  ∟ Like successfully put ⚝ `))
      })
      .catch(() => {
        console.log(chalk.red(`  ∟ Failed to like`))
      });
  } else {
    console.log(chalk.blue(`  ∟ Like already worth, skip ⚝ `))
  }
};
