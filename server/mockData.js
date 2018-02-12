const uuid = require('uuid');
const status = [true, false];
const categories = ['action',
  'international', 'comedy', 'sci-fi', 'horror', 'drama', 'thriller', 'romance', 'docuseries', 'mystery'];
const regions = ['North America', 'South America', 'Europe', 'Africa', 'Antartica', 'Asia', 'Australia'];
getRandomInt = (min, max) => {
  const min1 = Math.ceil(min);
  const max2 = Math.floor(max);
  return Math.floor(Math.random() * (max2 - min1)) + min1;
};
const loginEvent = {
  timestamp: Date.now(),
  userId: uuid.v4(),
  region: regions[getRandomInt(0, 7)],
  log: 'login',
  sessionId: uuid.v4(),
};
const searchEvent = {
  searchId: uuid.v4(),
  timestamp: Date.now(),
  userId: uuid.v4(),
  searchTerm: 'green',
  sessionId: uuid.v4(),
  region: regions[getRandomInt(0, 7)],
};
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
const watchEvent = {
  viewId: uuid.v4(),
  timestamp: Date.now(),
  genre: categories[getRandomInt(0, 11)],
  userId: uuid.v4(),
  minutesWatched: getRandomInt(0, 107),
  region: regions[getRandomInt(0, 7)],
  movieId: uuid.v4(),
  sessionId: uuid.v4(),
};
const movieWatched = {
  userID: uuid.v4(),
  movieID: uuid.v4(),
  finished: status[getRandomInt(0, 2)],
  timeRemaining: '' + getRandomInt(0, 60) + ':' + getRandomInt(0, 60),
};
const logoutEvent = {
  timestamp: Date.now(),
  userId: uuid.v4(),
  region: regions[getRandomInt(0, 7)],
  log: 'logout',
  sessionId: uuid.v4(),
};
module.exports.movieWatched = movieWatched;
module.exports.watchEvent = watchEvent;
module.exports.genreEvent = genreEvent;
module.exports.searchEvent = searchEvent;
module.exports.loginEvent = loginEvent;
module.exports.logoutEvent = logoutEvent;

