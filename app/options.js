module.exports = {
  hashTagUri: 'https://instagram.com/explore/tags/%D0%BC%D0%B0%D0%BD%D0%B8%D0%BA%D1%8E%D1%80/',

  authData: {
    username:'89818324892',
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
    subscribe: true
  }
};
