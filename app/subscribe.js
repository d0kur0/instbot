const chalk = require('chalk');

module.exports = async (page) => {
  let existsBtn = await page.$('div.PQo_0 > div.bY2yH > button');

  if (existsBtn) {
    await page.click('div.PQo_0 > div.bY2yH > button')
      .then(() => {
        console.log(chalk.green(`  ∟ Have successfully subscribed`))
      })
      .catch(() => {
        console.log(chalk.red(`  ∟ A subscription button was found but could not be signed`))
      });
  }
};
