module.exports = {
  hashTagUri: 'https://instagram.com/explore/tags/маникюр/',

  authData: {
    username: '89818324892',
    password: 'popkaass99',
  },

  browserOptions: {
    ignoreHTTPSErrors: true,
    headless: false,
    args: [`--window-size=1240,1024`]
  },

  bot: {
    removePopular: true,
    setLike: true,
    subscribe: true,
    delay: 5000
  }
};
