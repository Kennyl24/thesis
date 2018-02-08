const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/client_server.js');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('Cassandra connection', () => {
  it('client.connect should', (done) => {
    server.client.connect((err, result) => {
      console.log('in here');
      if (err) {
        done(err);
      }
      expect(server.client.hosts.length).to.equal(1);
      console.log(server.client.metadata.keyspaces.netflixevents);
      server.client.metadata.keyspaces.should.have.property('netflixevents');
      done();
    });
  });
});
describe('/GET user login', () => {

  it('should get user logins', (done) => {
    chai.request(server)
      .get('/userLogin')
      .end((err, res) => {
        should.not.exist(err);
        res.type.should.equal('text/html');
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.text.should.be.a('string');
        res.text.should.equal('thank you');
        done();
      });
  });
});

describe('/GET user signout', () => {

  it('should return Not Found', (done) => {
    chai.request(server)
      .get('/INVALID_PATH')
      .end(function(res) {
        res.should.have.status(404);
        done();
      });
  });
});

describe('/GET user signout', () => {

  it('it should GET user signouts', (done) => {
    chai.request(server)
      .get('/userSignout')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.type.should.equal('text/html');
        res.body.should.be.a('object');
        res.text.should.be.a('string');
        res.text.should.equal('thank you');
        done();
      });
  });
});

describe('/GET search history', () => {

  it('it should GET all search history', (done) => {
    chai.request(server)
      .get('/searchHistory')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.type.should.equal('text/html');
        res.body.should.be.a('object');
        res.text.should.be.a('string');
        res.text.should.equal('got it');
        done();
      });
  });
});

describe('/GET genres', () => {
  it('it should GET all genres and content', (done) => {
    chai.request(server)
      .get('/genres')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should send proper response', (done) => {
    chai.request(server)
      .get('/genres')
      .end((err, res) => {
        should.not.exist(err);
        res.type.should.equal('text/html');
        res.body.should.be.a('object');
        res.text.should.be.a('string');
        res.text.should.equal('thank you');
        done();
      });
  });
});

describe('/GET movies watched', () => {

  it('it should GET all movies watched and time', (done) => {
    chai.request(server)
      .get('/moviesWatched')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should send proper response', (done) => {
    chai.request(server)
      .get('/moviesWatched')
      .end((err, res) => {
        should.not.exist(err);
        res.type.should.equal('text/html');
        res.body.should.be.a('object');
        res.text.should.be.a('string');
        res.text.should.equal('got it');
        done();
      });
  });
});

describe('/POST user video', () => {

  it('it should POST user video', (done) => {
    chai.request(server)
      .post('/userVideo')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('it should contain all neccessary information user video', (done) => {
    chai.request(server)
      .post('/userVideo')
      .end((err, res) => {
        res.body.should.have.property('userID');
        res.body.should.be.a('object');
        res.body.should.have.property('movieID');
        res.body.should.have.property('timeRemaining');
        res.body.should.have.property('finished');
        res.body.finished.should.be.a('boolean');
        done();
      });
  });
});

describe('/POST user video', () => {

  it('should return Bad Request', (done) => {
    chai.request(server)
      .post('/INVALID_PATH')
      .end(function(res) {
        res.should.have.status(404);
        done();
      });
  });
});