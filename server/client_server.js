const nr = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cassandra = require('cassandra-driver');
const mockData = require('./mockData.js');
const client = new cassandra.Client({ contactPoints: ['localhost'], keyspace: 'netflixevents' });
client.connect()
  .then(function () {
    console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
    console.log('Keyspaces: %j', Object.keys(client.metadata.keyspaces));
    console.log('Shutting down');
    return client.shutdown();
  })
  .catch(function (err) {
    console.error('There was an error when connecting', err);
    return client.shutdown();
  });
app.use(bodyParser.json());
const Promise = require('bluebird');
const request = require('request');
app.use(express.static('client'));
app.use(express.static(path.join(__dirname, 'client')));
const kafka = require('kafka-node');
const kafkaClient = new kafka.Client();
const producer = new kafka.HighLevelProducer(kafkaClient);
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
producer.on('error', (err) => { console.log('hi', err); });
app.get('/userLogin', (req, response) => {
  console.log('in here');
  const logEvent = mockData.loginEvent;
  //const logEvent = req.body;
  const buffer = new Buffer.from(JSON.stringify(logEvent));
  console.log(logEvent);
  const record = [
    {
      topic: 'newTop4',
      messages: buffer,
      attributes: 1 
    }
  ];
  producer.send(record, () => {
    console.log('donerd sending payloads', buffer);
  });
  response.send('thank you');
});
app.get('/userSignout', (req, response) => {
  const signoutEvent = mockData.logoutEvent;
  const buffer = new Buffer.from(JSON.stringify(signoutEvent));
  const record = [
    {
      topic: 'signoutLogs',
      messages: signoutEvent,
      attributes: 1 
    }
  ];
  producer.send(record, () => {
    console.log('done sending payloads');
  });
  response.send('thank you');
});
app.get('/searchHistory', (req, response) => {
  const searchEvent = mockData.searchEvent;
  const buffer = new Buffer.from(JSON.stringify(searchEvent));
  const record = [
    {
      topic: 'searches',
      messages: buffer,
      attributes: 1 
    }
  ];
  producer.send(record, () => {
    console.log('done sending payloads');
  });
  response.send('got it');
});
app.get('/genres', (req, response) => {
  const genreEvent = mockData.genreEvent;
  const buffer = new Buffer.from(JSON.stringify(genreEvent));
  const record = [
    {
      topic: 'ratios',
      messages: buffer,
      attributes: 1 
    }
  ];
  producer.send(record, () => {
    console.log('done sending payloads');
  });
  response.send('thank you');
});
app.get('/moviesWatched', (req, response) => {
  const watchEvent = mockData.watchEvent;
  const minuteBuffer = new Buffer.from(JSON.stringify(watchEvent.minutesWatched));
  const buffer = new Buffer.from(JSON.stringify(watchEvent));
  console.log(watchEvent);
  const record = [
    {
      topic: 'newTop',
      messages: buffer,
      attributes: 1
    },
    {
      topic: 'newTop12',
      messages: minuteBuffer,
      attributes: 1
    }
  ];
  producer.send(record, () => {
    console.log('done sending payloads');
  });
  response.send('got it');
});
app.post('/userVideo', (req, response) => {
  const movieWatched = mockData.movieWatched;
  response.send(movieWatched);
});
// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   http.createServer((req, res) => {
//     res.writeHead(200);
//     res.end();
//   }).listen(3100);
//   console.log(`Worker ${process.pid} started`);
// }
app.listen(3100, () => {
  console.log('listening on port 3100!');
});
module.exports = app;
module.exports.client = client;