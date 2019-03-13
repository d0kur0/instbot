module.exports = async (page) => {
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
};
