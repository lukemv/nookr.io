const mongoose = require('mongoose');
const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');
const sleep = require('sleep');
const Book = require('./NYBook');

const mongoUrl = process.env.MongoUrl || 'mongodb://localhost/nookr';
mongoose.connect(mongoUrl);

const log = {
  info: (message) => {
    console.log(chalk.blue(`[i][${moment().format()}]`) + ': ' + message);
  },
  error: (error) => {
    console.log(chalk.red(`[!][${moment().format()}]`) + ': ' + error);
  }
}

const stopWeek = moment('2013-01-01');
const sleepSeconds = 5;

function GetBooks(week) {
  // Replace with
 // axios.get('https://api.nytimes.com/svc/books/v3/lists//.json', {
 //     params: {
 //       'api-key': '29ff6820315e44e5b7b9060c0aa39d52',
 //       'list': 'combined-print-and-e-book-fiction',
 //       'published-date': currentWeek.format('YYYY-MM-DD')
 //     }
 // }
  return new Promise((resolve, reject) => {
    // Simulated failure
    const shouldFail = Math.random() >= 0.5;
    if (shouldFail) {
      return reject('Simulated HTTP request Failure');
    }
    return resolve({
      data: [
        {
          book_details: [{
            title: 'title-foo',
            author: 'author-foo',
            primary_isbn13: 'foo isbn'
          }],
          published_date: 'some date',
        },
        {
          book_details: [{
            title: 'title-bar',
            author: 'author-bar',
            primary_isbn13: 'bar isbn'
          }],
          published_date: 'some date',
        }
      ]
    });
  });
}

function Worker(week) {
  log.info(`Processing Week: ${week}`)

  if (week.isBefore(stopWeek)) {
    log.info(`Processing Completed: ${week} is earlier than ${stopWeek}`);
    return;
  }

  GetBooks(week).then((response) => {
    log.info(`Received ${response.data.length} books from the API`);
    const books = response.data.map((book) => {
      return new Book({
        title: book.book_details[0].title,
        author: book.book_details[0].author,
        listDate: book.published_date,
        ISBN: book.book_details[0].primary_isbn13
      });
    });

    log.info(`Saving ${books.length} books`);
    Book.collection.insert(books, (err, res) => {
      previousWeek = week.subtract(7, 'days');
      log.info(`Setting current week to ${previousWeek}`);
      log.info(`Sleeping for ${sleepSeconds} seconds`);
      sleep.sleep(sleepSeconds);
      Worker(previousWeek);
    });
  }, (error) => {
    log.error('Error during HTTP request');
    log.error(error)
    log.info(`Sleeping for ${sleepSeconds} seconds`);
    sleep.sleep(sleepSeconds);
    Worker(week);
  });
}

Worker(moment());