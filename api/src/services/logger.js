const chalk = require('chalk');

module.exports = {
  debug: (message, source) => {
  },
  info: (message, source) => {
    console.log(`${chalk.blue('[INF]')}:(${chalk.blue(source || 'default')}) ${message}`);
  },
  error: (message, source) => {
    console.log(chalk.red(`[ERR]:(${(source || 'default')}) ${message}`));
  }
};
