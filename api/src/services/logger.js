const chalk = require('chalk');
const moment = require('moment');

module.exports = {
  debug: (message, source) => {
    const date = moment();
    console.log(`[${date}] ${chalk.gray('[DBG]')} (${chalk.gray(source || 'default')}) ${message}`);
  },
  info: (message, source) => {
    const date = moment();
    console.log(`[${date}] ${chalk.blue('[INF]')} (${chalk.blue(source || 'default')}) ${message}`);
  },
  error: (message, source) => {
    console.log(chalk.red(`[ERR]:(${(source || 'default')}) ${message}`));
  }
};
