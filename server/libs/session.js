let mongoose = require('mongoose');
let Session = mongoose.model('Session');
let session = {};


let response = {
    success: false,
    code: "",
    data: null,
    userMessage: ''
};
let SendResponse = function(res, status) {
    return res.status(status || 200).send(response);
};

/*********************
    Checking for token of loggedin user
*********************/


session.checkToken = function(req, res, next) {

    let bearerToken;
    let bearerHeader = req.headers["authorization"];
    if (typeof(bearerHeader) !== 'undefined') {
        let bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
    }
    let token = bearerToken || req.body.token || req.query.token;

    Session
      .findOne({
          token: token
      })
      .populate('user', {
          _id: true,
          email: true,
          link: true,
          fontSize: true,
          fontColor:true,
          headlineColor:true,
          backgroundColor:true
      })
      .lean()
      .exec(function(err, data) {
        if (err) {
          response.success = false;
          response.code = 10901;
          response.userMessage = "There was a problem with the request, please try again."
          return SendResponse(res, 500);
        } else {
          if (data) { // Horray!! Your session exists.
            req.user = data.user;
            return next();
          } else {
            response.success = false;
            response.userMessage = "Your session doesn't exits.";
            return SendResponse(res, 403);
          }
        }
      });
};

/*********************
    checkToken Ends
*********************/


module.exports = session;
