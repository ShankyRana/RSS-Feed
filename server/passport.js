/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var user = mongoose.model('user');

var local = require('./passport/local');

/***
 **Expose
 ***/

module.exports = function (passport, config) {
  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    user.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })

  // use these strategies
  passport.use(local);
};
