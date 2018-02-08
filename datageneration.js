const express = require('express');

const app = express();
const faker = require('faker');
const fs = require('fs');
const csvStringify = require('csv-stringify');

const regions = ['North America', 'South America', 'Europe', 'Africa', 'Antartica', 'Asia', 'Australia'];
const getRandomInt = (min, max) => {
  const min1 = Math.ceil(min);
  const max2 = Math.floor(max);
  return Math.floor(Math.random() * (max2 - min1)) + min1;
};
const generateHistoricLogin = () => {
  const historicLogins = [];
  for (let i = 0; i < 2500000; i += 1) {
    const loginEvent = {};
    loginEvent.event_userID = faker.random.uuid();
    loginEvent.event_time = faker.date.past();
    loginEvent.event_log = 'login';
    loginEvent.event_region = regions[getRandomInt(0, 7)];
    historicLogins.push(loginEvent);
  }
  const csvWrite = fs.createWriteStream('loginData.csv', 'utf8');
  csvStringify(historicLogins, (error, output) => {
    csvWrite.write(output, 'utf8');
    csvWrite.end();
    console.log('theres that data');
  });
};
const generateHistoricLogout = () => {
  const historicLogouts = [];
  for (let i = 0; i < 2500000; i += 1) {
    const logoutEvent = {};
    logoutEvent.event_userID = faker.random.uuid();
    logoutEvent.event_time = faker.date.past();
    logoutEvent.event_log = 'logout';
    logoutEvent.event_region = regions[getRandomInt(0, 7)];
    historicLogouts.push(logoutEvent);
  }
  const csvWrite = fs.createWriteStream('logoutData.csv', 'utf8');
  csvStringify(historicLogouts, (error, output) => {
    csvWrite.write(output, 'utf8');
    csvWrite.end();
    console.log('theres that data2');
  });
};
const generateHistoricSearch = () => {
  const historicSearches = [];
  for (let i = 0; i < 2500000; i += 1) {
    const searchEvent = {};
    searchEvent.event_userID = faker.random.uuid();
    searchEvent.event_time = faker.date.past();
    searchEvent.event_search = faker.random.word();
    searchEvent.event_region = regions[getRandomInt(0, 7)];
    historicSearches.push(searchEvent);
  }
  const csvWrite = fs.createWriteStream('searchData.csv', 'utf8');
  csvStringify(historicSearches, (error, output) => {
    csvWrite.write(output, 'utf8');
    csvWrite.end();
    console.log('theres that data3');
  });
};
const generateHistoricMinutes = () => {
  const historicMinutes = [];
  for (let i = 0; i < 1250000; i += 1) {
    const watchEvent = {};
    watchEvent.event_userID = faker.random.uuid();
    watchEvent.event_movieID = faker.random.uuid();
    watchEvent.event_time = faker.date.past();
    watchEvent.event_minutes = getRandomInt(0, 150);
    watchEvent.event_category = faker.random.arrayElement(['action',
      'international', 'comedy', 'sci-fi', 'horror', 'drama', 'thriller', 'romance', 'docuseries', 'mystery']);
    watchEvent.event_region = regions[getRandomInt(0, 7)];
    historicMinutes.push(watchEvent);
  }
  const csvWrite = fs.createWriteStream('minutesDataTwo.csv', 'utf8');
  csvStringify(historicMinutes, (error, output) => {
    if (error) {
      console.log(error);
    }
    csvWrite.write(output, 'utf8');
    csvWrite.end();
    console.log('theres that data4');
  });
};
generateHistoricLogin();
generateHistoricLogout();
generateHistoricSearch();
generateHistoricMinutes();
app.listen(3900, () => {
  console.log('listening on port 3100!');
});
