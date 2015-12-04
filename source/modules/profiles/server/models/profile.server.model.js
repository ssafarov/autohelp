'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  latitude:{
    type: Number,
    default: 0,
    trim: true
  },
  longitude:{
    type: Number,
    default: 0,
    trim: true
  }
});

mongoose.model('Profile', ProfileSchema);
