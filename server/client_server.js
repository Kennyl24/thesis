const nr = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
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
    client.shutdown();
  })
  .catch(function (err) {
    console.error('There was an error when connecting', err);
    client.shutdown();
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
const numCPUs = require('os').cpus().length;
const uuid = require('uuid');
const status = [true, false];
const categories = ['action', 'international', 'comedy', 'sci-fi', 'horror', 'drama', 'thriller', 'romance', 'docuseries', 'mystery'];
const regions = ['North America', 'South America', 'Europe', 'Africa', 'Antartica', 'Asia', 'Australia'];
getRandomInt = (min, max) => {
  const min1 = Math.ceil(min);
  const max2 = Math.floor(max);
  return Math.floor(Math.random() * (max2 - min1)) + min1;
};
producer.on('error', (err) => { console.log('hi', err); });
app.get('/userLogin', (req, response) => {
  const loginEvent = {
    timestamp: Date.now(),
    userId: uuid.v4(),
    region: regions[getRandomInt(0, 7)],
    log: 'login',
    sessionId: uuid.v4(),
  };
  const logEvent = mockData.loginEvent;
  //const logEvent = req.body;
  const buffer = new Buffer.from(JSON.stringify(loginEvent));
  console.log(logEvent);
  const record = [
    {
      topic: 'login',
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
  // const signoutEvent = req.body;
  const signoutEvent = mockData.logoutEvent;
  const buffer = new Buffer.from(JSON.stringify(signoutEvent));
  const record = [
    {
      topic: 'logout',
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
  // const searchEvent = req.body;
  const searchEvent = mockData.searchEvent;
  const buffer = new Buffer.from(JSON.stringify(searchEvent));
  const record = [
    {
      topic: 'search',
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
  const genreEvent = {
    action: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 600000,
        totalTime: 360000000
      }
    },
    international: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
    comdedy: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
    scifi: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
    horror: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
    drama: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
    thriller: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
    romance: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
    docuseries: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
    mystery: {
      original: {
        totalCount: 600000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
    totals: {
      original: {
        totalCount: 3000000,
        totalTime: 72000000
      },
      licenced: {
        totalCount: 3000000,
        totalTime: 360000000
      }
    },
  };
  // const genreEvent = req.body;
  const buffer = new Buffer.from(JSON.stringify(genreEvent));
  const record = [
    {
      topic: 'finalTesty',
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
  const watchEvent = {
    viewId: uuid.v4(),
    timestamp: Date.now(),
    userId: uuid.v4(),
    minutesWatched: getRandomInt(0, 107),
    region: regions[getRandomInt(0, 7)],
    movieId: uuid.v4(),
    genre: categories[getRandomInt(0, 9)],
    sessionId: uuid.v4(),
  };
  // const watchEvent = mockData.watchEvent;
  const minuteBuffer = new Buffer.from(JSON.stringify(watchEvent.minutesWatched));
  const buffer = new Buffer.from(JSON.stringify(watchEvent));
  const genreBuffer = new Buffer.from(JSON.stringify(watchEvent.genre));
  console.log(watchEvent);
  const record = [
    {
      topic: 'watched_videos',
      key: genreBuffer,
      messages: buffer,
      attributes: 1,
      timestamp: Date.now(),
    },
    {
      topic: 'finalTester1',  
      messages: minuteBuffer,
      key: genreBuffer,
      attributes: 1,
      timestamp: Date.now(),
    }
    // minutecollector
  ];
  producer.send(record, () => {
    console.log('done sending payloads');
  });
  sendToUserService(watchEvent);
  response.send('got it');
});
const sendToUserService = (data) => {
  console.log('in func');
  app.post('/userVideo', (req, res) => {
    console.log('in post');
    // const movieWatched = mockData.movieWatched;
    res.send(data);
    console.log(res);
  });
};
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  http.createServer(app).listen(3100);
  console.log(`Worker ${process.pid} started`);
}
module.exports = app;
module.exports.client = client;