'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Profile = mongoose.model('Profile'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, profile;

/**
 * Profile routes tests
 */
describe('Profile CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new profile
    user.save(function () {
      profile = {
        title: 'Profile Title',
        content: 'Profile Content'
      };

      done();
    });
  });

  it('should be able to save an profile if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new profile
        agent.post('/api/profiles')
          .send(profile)
          .expect(200)
          .end(function (profileSaveErr, profileSaveRes) {
            // Handle profile save error
            if (profileSaveErr) {
              return done(profileSaveErr);
            }

            // Get a list of profiles
            agent.get('/api/profiles')
              .end(function (profilesGetErr, profilesGetRes) {
                // Handle profile save error
                if (profilesGetErr) {
                  return done(profilesGetErr);
                }

                // Get profiles list
                var profiles = profilesGetRes.body;

                // Set assertions
                (profiles[0].user._id).should.equal(userId);
                (profiles[0].title).should.match('Profile Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an profile if not logged in', function (done) {
    agent.post('/api/profiles')
      .send(profile)
      .expect(403)
      .end(function (profileSaveErr, profileSaveRes) {
        // Call the assertion callback
        done(profileSaveErr);
      });
  });

  it('should not be able to save an profile if no title is provided', function (done) {
    // Invalidate title field
    profile.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new profile
        agent.post('/api/profiles')
          .send(profile)
          .expect(400)
          .end(function (profileSaveErr, profileSaveRes) {
            // Set message assertion
            (profileSaveRes.body.message).should.match('Title cannot be blank');

            // Handle profile save error
            done(profileSaveErr);
          });
      });
  });

  it('should be able to update an profile if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new profile
        agent.post('/api/profiles')
          .send(profile)
          .expect(200)
          .end(function (profileSaveErr, profileSaveRes) {
            // Handle profile save error
            if (profileSaveErr) {
              return done(profileSaveErr);
            }

            // Update profile title
            profile.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing profile
            agent.put('/api/profiles/' + profileSaveRes.body._id)
              .send(profile)
              .expect(200)
              .end(function (profileUpdateErr, profileUpdateRes) {
                // Handle profile update error
                if (profileUpdateErr) {
                  return done(profileUpdateErr);
                }

                // Set assertions
                (profileUpdateRes.body._id).should.equal(profileSaveRes.body._id);
                (profileUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of profiles if not signed in', function (done) {
    // Create new profile model instance
    var profileObj = new Profile(profile);

    // Save the profile
    profileObj.save(function () {
      // Request profiles
      request(app).get('/api/profiles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single profile if not signed in', function (done) {
    // Create new profile model instance
    var profileObj = new Profile(profile);

    // Save the profile
    profileObj.save(function () {
      request(app).get('/api/profiles/' + profileObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', profile.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single profile with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/profiles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Profile is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single profile which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent profile
    request(app).get('/api/profiles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No profile with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an profile if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new profile
        agent.post('/api/profiles')
          .send(profile)
          .expect(200)
          .end(function (profileSaveErr, profileSaveRes) {
            // Handle profile save error
            if (profileSaveErr) {
              return done(profileSaveErr);
            }

            // Delete an existing profile
            agent.delete('/api/profiles/' + profileSaveRes.body._id)
              .send(profile)
              .expect(200)
              .end(function (profileDeleteErr, profileDeleteRes) {
                // Handle profile error error
                if (profileDeleteErr) {
                  return done(profileDeleteErr);
                }

                // Set assertions
                (profileDeleteRes.body._id).should.equal(profileSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an profile if not signed in', function (done) {
    // Set profile user
    profile.user = user;

    // Create new profile model instance
    var profileObj = new Profile(profile);

    // Save the profile
    profileObj.save(function () {
      // Try deleting profile
      request(app).delete('/api/profiles/' + profileObj._id)
        .expect(403)
        .end(function (profileDeleteErr, profileDeleteRes) {
          // Set message assertion
          (profileDeleteRes.body.message).should.match('User is not authorized');

          // Handle profile error error
          done(profileDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Profile.remove().exec(done);
    });
  });
});
