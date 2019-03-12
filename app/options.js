module.exports = {
  hashTagUri: 'https://instagram.com/explore/tags/маникюр/',

  authData: {
    username: '89818324892',
    password: 'popkaass99',
  },

  browserOptions: {
    ignoreHTTPSErrors: true,
    headless: false,
    args: [`--window-size=800,600`]
  },

  bot: {
    removePopular: true,
    setLike: true,
    subscribe: true,
    setComment: true,
    delayBeforeComment: 5000,
    delayBeforeIteration: 5000,
    delayBeforeLike: 1000,
    delayBeforeSubscribe: 5000
  }
};
