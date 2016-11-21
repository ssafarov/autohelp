'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Profile = mongoose.model('Profile'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a profile
 */
exports.create = function (req, res) {
  var profile = new Profile(req.body);
  profile.user = req.user;

  profile.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profile);
    }
  });
};

/**
 * Show the current profile
 */
exports.read = function (req, res) {
  res.json(req.profile);
};

/**
 * Update a profile
 */
exports.update = function (req, res) {
  var profile = req.profile;

  profile.title = req.body.title;
  profile.content = req.body.content;

  profile.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profile);
    }
  });
};

/**
 * Delete an profile
 */
exports.delete = function (req, res) {
  var profile = req.profile;

  profile.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profile);
    }
  });
};

/**
 * List of Profiles
 */
exports.list = function (req, res) {
  console.log(req.ip);
  Profile.find().sort('-created').populate('user', 'displayName').exec(function (err, profiles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(profiles);
    }
  });
};

/**
 * Profile middleware
 */
exports.profileByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Profile is invalid'
    });
  }

  Profile.findById(id).populate('user', 'displayName').exec(function (err, profile) {
    if (err) {
      return next(err);
    } else if (!profile) {
      return res.status(404).send({
        message: 'No profile with that identifier has been found'
      });
    }
    req.profile = profile;
    next();
  });
};
