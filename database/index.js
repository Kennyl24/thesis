const Promise = require('bluebird');
const cassandra = require('cassandra-driver');
const cron = require('cron');
const fs = require('fs');
const csvStringify = require('csv-stringify');
const client = new cassandra.Client({ contactPoints: ['localhost'], keyspace: 'netflixevents' });
client.connect()
  .then(function () {
    console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
    console.log('Keyspaces: %j', Object.keys(client.metadata.keyspaces));
    console.log('Shutting down');
    client.shutdown();
  })
  .catch(function (err) {
    console.error('There was an error when connecting', err);
    client.shutdown();
  });
const date = new Date();
const todaysDate = JSON.stringify(date).split('T')[0].slice(1);
date.setDate(date.getDate() - 1);
const yesterdaysDate = JSON.stringify(date).split('T')[0].slice(1);

getBusinessQuestionMinuteData = (yesterdaysDate) => {
  let query = `SELECT * FROM minutesWatched WHERE date = ${yesterdaysDate}`;
  return new Promise ((resolve, reject) => { 
    client.execute(query, (err, result) => {
      if (err) { 
        reject(err); 
      } else { 
        resolve(result); 
        const csvWrite = fs.createWriteStream('minuteLog.csv', 'utf8');
        csvStringify(result, (error, output) => {
          csvWrite.write(output, 'utf8');
          csvWrite.end();
          console.log('theres that minute data');
        });
      }
    });
  });
},
getBusinessQuestionRatioData = (yesterdaysDate) => {
  let query = `SELECT * FROM dailyratios WHERE date = ${yesterdaysDate}`;
  return new Promise ((resolve, reject) => { 
    client.execute(query, (err, result) => {
      if (err) { 
        reject(err); 
      } else { 
        resolve(result); 
        const csvWrite = fs.createWriteStream('ratioLog.csv', 'utf8');
        csvStringify(result, (error, output) => {
          csvWrite.write(output, 'utf8');
          csvWrite.end();
          console.log('theres that ratio data');
        });
      }
    });
  });
};
const getMinuteJob = new cron.CronJob({
  cronTime: '00 11 12 * *',
  onTick: getBusinessQuestionMinuteData(),  
  // at this time (10 minutes later than insertion, retrvieve data and save to CSV for data scientists to anaylze )
  start: false,
  timeZone: 'America/Los_Angeles',
});
const ratioJob = new cron.CronJob({
  cronTime: '00 11 12 * *',
  onTick: getBusinessQuestionRatioData(),  
  start: false,
  timeZone: 'America/Los_Angeles',
});
getMinuteJob.start();
ratioJob.start();
//module.exports.insertBusinessQuestionMinuteLog = insertBusinessQuestionMinuteLog;
module.exports.client = client;