module.exports = async (page) => {
  let existsBtn = await page.evaluate(() => document.querySelector('.oW_lN._0mzm-.sqdOP.yWX7d'));

  if (existsBtn) {
    await page.click('.oW_lN._0mzm-.sqdOP.yWX7d')
      .then(() => {
        console.log(chalk.blue(`  ∟ Have successfully subscribed`))
      })
      .catch(() => {
        console.log(chalk.red(`  ∟ A subscription button was found but could not be signed`))
      });
  }
};
