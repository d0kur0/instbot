const chalk = require('chalk');

module.exports = {
  header (message) {
    console.log(chalk.green(`\r\n➣ ${message} `))
  },

  info (message) {
    console.log(chalk.blue(`  ∟ ${message} `))
  },

  success (message) {
    console.log(chalk.green(`  ∟ ${message} `))
  },

  error (message) {
    console.log(chalk.red(`  ∟ ${message} `))
  }
};
