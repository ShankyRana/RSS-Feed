/**
 * Module dependencies.
 */

let mongoose = require('mongoose');
let LocalStrategy = require('passport-local').Strategy;
let user = mongoose.model('user');
let Session = mongoose.model('Session');
let jwt = require('jsonwebtoken');
let sessionSecret="thisisareallylongsessionsecretandyoucanchangeitbutletitbelongggggg"

/**
 * Expose
 */

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    let options = {
      criteria: { email: email },
      select: 'name about email hashed_password salt'
    };
    user.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }

      //create session here.
      Session.findOne({user:user._id})
      .lean()
      .exec(function(err,session){
        if(session) {
          let token = jwt.sign({_id:String(user._id),firstname:user.firstname,lastname:user.lastname,email:user.email},sessionSecret);
          Session.findOneAndUpdate({_id:session._id},{token:token})
          .lean()
          .exec(function(err,session1){
              return done(null, user,{
                sessionToken:token,
                sessionId:session1._id
              });
          });
        } else {
          let token = jwt.sign({_id:String(user._id),firstname:user.firstname,lastname:user.lastname,email:user.email},sessionSecret);
          let newSession = new Session({
            user : user._id,
            token:token
          });
          newSession.save();
          return done(null, user,{
            sessionToken:newSession.token,
            sessionId:newSession._id
          });
        }
      });
    });
  }
);
