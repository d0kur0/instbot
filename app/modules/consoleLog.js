const chalk = require("chalk");

module.exports = {
  header(message) {
    console.log(chalk.cyan.bold(`\r\n➣ ${message} `));
  },

  info(message) {
    console.log(chalk.gray.bold(`  ⮡ ${message} `));
  },

  success(message) {
    console.log(chalk.yellow.bold(`  ⮡ ${message} `));
  },

  error(message) {
    console.log(chalk.red.bold(`  ⮡ ྾ ${message} `));
  },
};
