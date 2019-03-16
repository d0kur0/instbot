module.exports = {
  ignoreHTTPSErrors: true,
  headless: false,
  args: [
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certificate-errors',
    '--ignore-certificate-errors-spki-list'
  ]
};