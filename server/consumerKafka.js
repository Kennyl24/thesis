const express = require('express');
const app = express();
const { KafkaStreams } = require('kafka-streams');
const config = require('../config.js');
const kafkaStreams = new KafkaStreams(config.nativeConfig);
const loginStream = kafkaStreams.getKStream('newTop11');
const signoutStream = kafkaStreams.getKStream('signoutLogs');
const searchStream = kafkaStreams.getKStream('searches');
const vidoesViewedStream = kafkaStreams.getKStream('newTop');
const ratioStream = kafkaStreams.getKStream('ratios');
const minutesStream = kafkaStreams.getKStream('topy');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['localhost'], keyspace: 'excelsior' });
client.connect()
  .then(function () {
    console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
    console.log('Keyspaces: %j', Object.keys(client.metadata.keyspaces));
    console.log('Shutting down');
  })
  .catch(function (err) {
    console.error('There was an error when connecting', err);
    return client.shutdown();
  });
const uuid = require('uuid');
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
loginStream.forEach(message => {
  message = JSON.parse(message.value);
  const userTest = message.userId;
  const log = message.log;
  const region = message.region;
  const date = '' + message.timestamp;
  const loginQuery = 'INSERT INTO excelsior.testy (userid,date,log,region) VALUES (?, ?, ?, ?)';
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
  const query = 'INSERT INTO excelsior.signoutStream (userid,date,log,region) VALUES (?, ?, ?, ?)';
  client.execute(query, [userTest, date, log, region], { prepare: true})
    .then(result => console.log('query complete'));
});
signoutStream.start().then(_ => {
  console.log('starting signoutStream');
});
searchStream.forEach(message => {
  let testerooooo = [];
  message = JSON.parse(message.value);
  const userId = message.userId;
  const searchTerm = message.searchTerm;
  const region = message.region;
  const date = '' + message.timestamp;
  const query = 'INSERT INTO excelsior.searchTest (userid,date,searchTerm,region) VALUES (?, ?, ?, ?)';
  client.execute(query, [userId, date, searchTerm, region], { prepare: true})
    .then(result => console.log('query complete', result));
});
searchStream.start().then(_ => {
  console.log('starting Search Stream');
});
vidoesViewedStream.forEach(message => {
  message = JSON.parse(message.value);
  minutes.push(message.minutesWatched);
  const userId = message.userId;
  const movieId = message.viewId;
  const minutesWatched = message.minutesWatched;
  const region = message.region;
  const date = '' + message.timestamp;
  const query = 'INSERT INTO excelsior.viewTest (userid,movieid,minutesWatched, date, region) VALUES (?, ?, ?, ?, ?)';
  client.execute(query, [userId, movieId, JSON.stringify(minutesWatched), date, region], { prepare: true})
    .then(result => console.log('query complete'));
});
vidoesViewedStream.start().then(_ => {
  console.log('starting Video Viewed Stream');
});
ratioStream.forEach(message => {
  message = JSON.parse(message.value);
  console.log(message);
  // const query = 'INSERT INTO excelsior.testy (userid,date,log,region) VALUES (?, ?, ?, ?)';
  // client.execute(query, [userTest, date, log, region], { prepare: true})
  //   .then(result => console.log('query complete', result));
});
ratioStream.start().then(_ => {
  console.log('starting ratio Stream');
});
minutesStream
  .mapStringToKV(' ', 0, 1)
  .sumByKey('key', 'value', 'sum')
  .map(kv => parseInt(kv.value) + kv.sum)
  .tap(kv => console.log('shmeee', kv))
  .to('newTop3');
minutesStream.start().then(_ => {
  console.log('starting minutes calc Stream');
});
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end();
  }).listen(3800);
  console.log(`Worker ${process.pid} started`);
}
// app.listen(3800, () => {
//   console.log('listening on port 3100!');
// });