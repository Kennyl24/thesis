const express = require('express');
const app = express();
const { KafkaStreams } = require('kafka-streams');
const config = require('../config.js');
const kafkaStreams = new KafkaStreams(config.nativeConfig);
const loginStream = kafkaStreams.getKStream('login');
const signoutStream = kafkaStreams.getKStream('logout');
const searchStream = kafkaStreams.getKStream('search');
const vidoesViewedStream = kafkaStreams.getKStream('watched_videos');
const ratioStream = kafkaStreams.getKStream('finalTesty');
//const minutesStream = kafkaStreams.getKStream('finalTester1'); // minuteCollector
//const logStream = kafkaStreams.getKStream('whateverissavedforminutestsream'); 
const cron = require('cron');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['localhost'], keyspace: 'netflixevents' });
const cluster = require('cluster');
const http = require('http');
//const database = require('../database/index.js');
const port = process.env.port || 3800;
const numCPUs = require('os').cpus().length;
// const logMinuteJob = new cron.CronJob({
//   cronTime: '00 01 12 * *',
//   onTick: insertBusinessQuestionMinuteLog(),  
//   // at this time (10 minutes later than insertion, retrvieve data and save to CSV for data scientists to anaylze )
//   start: false,
//   timeZone: 'America/Los_Angeles',
// });
// logMinuteJob.start();
loginStream.forEach(message => {
  console.log('in here doe', message);
  message = JSON.parse(message.value);
  const userTest = message.userId;
  const log = message.log;
  const region = message.region;
  const date = '' + message.timestamp;
  const loginQuery = 'INSERT INTO netflixevents.login (user_id,posted_date,log,region) VALUES (?, ?, ?, ?)';
  client.execute(loginQuery, [userTest, date, log, region], { prepare: true})
    .then(result => console.log('query complete'));
});
loginStream.start().then(_ => {
  console.log('starting stream');
});
signoutStream.forEach(message => {
  message = JSON.parse(message.value);
  console.log(message);
  const userTest = message.userId;
  const log = message.log;
  const region = message.region;
  const date = '' + message.timestamp;
  const query = 'INSERT INTO netflixevents.logout (user_id,posted_date,log,region) VALUES (?, ?, ?, ?)';
  client.execute(query, [userTest, date, log, region], { prepare: true})
    .then(result => console.log('query complete'));
});
signoutStream.start().then(_ => {
  console.log('starting signoutStream');
});
searchStream.forEach(message => {
  message = JSON.parse(message.value);
  const userId = message.userId;
  const searchTerm = message.searchTerm;
  const region = message.region;
  const date = '' + message.timestamp;
  const query = 'INSERT INTO netflixevents.search (user_id,posted_date,search_term,region) VALUES (?, ?, ?, ?)';
  client.execute(query, [userId, date, searchTerm, region], { prepare: true})
    .then(result => console.log('query complete', result));
});
searchStream.start().then(_ => {
  console.log('starting Search Stream');
});
vidoesViewedStream.forEach(message => {
  message = JSON.parse(message.value);
  const userId = message.userId;
  const movieId = message.viewId;
  const minutesWatched = message.minutesWatched;
  const region = message.region;
  const date = '' + message.timestamp;
  const category = message.category; 
  const query = 'INSERT INTO netflixevents.watched_videos (user_id, category, movie_id,minutes, posted_date, region) VALUES (?, ?, ?, ?, ?, ?)';
  client.execute(query, [userId, category, movieId, JSON.stringify(minutesWatched), date, region], { prepare: true})
    .then(result => console.log('query complete'));
});
vidoesViewedStream.start().then(_ => {
  console.log('starting Video Viewed Stream');
});
ratioStream.take(1);
ratioStream.forEach(message => {
  message = JSON.parse(message.value);
  const date = JSON.stringify(JSON.stringify(new Date()).split('T')[0].slice(1));
  const ratiolog = JSON.stringify(message);
  const query = 'INSERT INTO netflixevents.daily_ratios (date, ratiolog) VALUES (?, ?)';
  client.execute(query, [date, ratiolog], { prepare: true})
    .then(result => console.log('query complete', result));
});
ratioStream.start().then(_ => {
  console.log('starting ratio Stream');
});
// minutesStream
//   .mapStringToKV(' ', 0, 1)
//   .sumByKey('key', 'value', 'sum')
//   .map(kv => JSON.parse(kv.key) + ':' + (kv.sum))
//   .tap(kv => console.log(kv))
//   .to('finalTester2');
// minutesStream.start().then(_ => {
//   console.log('starting minutes calc Stream');
// });
// const insertBusinessQuestionMinuteLog = () => {
//   logStream.forEach(message => {
//     message = JSON.parse(message.value);
//     const minutesLog = JSON.stringify(message);
//     const todaysDate = JSON.stringify(date).split('T')[0].slice(1);
//     const query = 'INSERT INTO netflixevents.minutesWatched (date,minutesLog) VALUES (?, ?)';
//     client.execute(query, [todaysDate, minutesLog], { prepare: true})
//       .then(result => console.log('query complete'));
//   });
// };
// log.start().then(_ => {
//   console.log('starting log calc Stream');
// });
// if (cluster.isMaster) {
//   console.log(`THIsMaster ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   http.createServer(app).listen(port);
//   console.log(`Worker ${process.pid} started`);
// }

app.listen(port, () =>  {
  console.log("Listening on port 3800");
});