module.exports = {
  hashTagUri: 'https://instagram.com/explore/tags/маникюр/',

  authData: {
    username: '89818324892',
    password: 'popkaass99',
  },

  browserOptions: {
    ignoreHTTPSErrors: true,
    headless: true,
    args: [
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list'
    ]
  },

  bot: {
    removePopular: true,
    setLike: true,
    subscribe: true,
    setComment: true,
    delayBeforeComment: 1000,
    delayBeforeIteration: 15000,
    delayBeforeLike: 1000,
    delayBeforeSubscribe: 1000
  }
};
