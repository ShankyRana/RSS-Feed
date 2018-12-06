/*
Load all models here
*/
let	mongoose = require('mongoose'),
	user = mongoose.model('user'),
	session = require('../libs/session'),
	Session = mongoose.model('Session'),
	jwt = require('jsonwebtoken'),
	uuid = require('node-uuid'),
	passport = require('passport'),
	Parser = require('rss-parser'),
	parser = new Parser();;

/*
Empty HTTP method object.
*/

let methods = {};
let response = {
    success: false,
    code: "",
    data: null,
    userMessage: '',
    errors: null
};

/*
Response goes here
*/
let SendResponse = function(res, response, status) {
    res.status(status || 200).send(response);
    return
};


/*
Routings/controller goes here
*/

module.exports = function(router) {
	router.route('/').get(function(req, res) {
    res.send(200, {
        "all": "ok"
    });
  });

  router.route('/user')
  	.post(methods.signup)
    .put(session.checkToken, methods.update);

  router.route('/user/session')
    .post(methods.userLogin)
    .delete(session.checkToken, methods.userlogout);

	router.route('/feeds')
    .post(methods.getFeeds);

	router.route('/ping')
        .get(session.checkToken, methods.getuser);
}


/**************************************************************************************************************************/
/***************************************** All the HTTP methods goes here *************************************************/
/**************************************************************************************************************************/

methods.update = function(req, res) {
	let response = {};

  req.checkBody('email', 'Email is required, ').notEmpty().isEmail();
	req.checkBody('fontSize', 'FontSize is required, ').notEmpty();
	req.checkBody('fontColor', 'FontColor is required, ').notEmpty();
	req.checkBody('headlineColor', 'HeadlineColor is required, ').notEmpty();
	req.checkBody('backgroundColor', 'BackgroundColor is required, ').notEmpty();

    let errors = req.validationErrors(true);
    if (errors) {
      response.success = false;
      response.errors = errors;
      response.code = 10801;
      response.userMessage = 'something went wrong';
      return SendResponse(res, response, 400);
    } else {
      user.findOneAndUpdate({
        _id: req.user._id
      }, {
        email: req.body.email,
        link: req.body.link,
				fontSize: req.body.fontSize,
				fontColor: req.body.fontColor,
				headlineColor: req.body.headlineColor,
				backgroundColor: req.body.backgroundColor,
      })
      .exec(function(err, data) {
        if (err) {
          response.success = false;
          response.code = 10901;
          response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?';
          return SendResponse(res, response, 500);
        } else {
          response.success = true;
          response.code = 200;
          response.userMessage = 'Successfully Updated ';
          return SendResponse(res, response, 200);
        }
      });
    }

}

/*********************
 signing up new user
*********************/
methods.signup = function(req, res) {
		let response = {};

    req.checkBody('password', 'Password is required, and should be between 8 to 80 characters.').notEmpty().len(8, 80);
    req.checkBody('email', 'email is required, and should be between 8 to 80 characters.').notEmpty().isEmail();;

    let errors = req.validationErrors(true);
    if (errors) {
      response.success = false;
      response.code = 10801;
      response.errors = errors;
      response.userMessage = 'Validation errors';
      return SendResponse(res, response, 400);
    } else {
      let my_email = req.param('email').toLowerCase()
      let newuser = new user({
        email: my_email,
				fontSize: 14,
				fontColor: 'lightgray',
				headlineColor: 'black',
				backgroundColor: 'white'
      });

      newuser.password = req.param('password');
      newuser.save(function(err, user_data) {
        if (err) {
          if (err.code === 11000) {
            response.success = false;
            response.code = 10902;
            response.userMessage = 'Email already registered.';
            response.errors = {
              email: {
                param: 'email',
                msg: 'Email already registered.',
                value: req.body.email
              }
            };
            return SendResponse(res, response, 208);
          } else {
            response.success = false;
            response.code = 10901;
            response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
            return SendResponse(res, response, 500);
          }
        } else {
          let secretKey = uuid.v4();
          let jwt_payload = {
              id: user_data._id,
              email: user_data.email
          }
          let token = jwt.sign(jwt_payload, secretKey, {
            expiresIn: 1140
          })

          let newSession = new Session({
            user: user_data,
            token: token
          });

          newSession.save(function(err, session) {
            if (err) {
              response.success = false;
              response.code = 10901;
              response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
              response.data = null;
              response.errors = null;
              return SendResponse(res, response, 500);
            } else {
              response.data = {
                user: user_data,
                token: session.token,
              };
              response.success = true;
              response.code = 200;
              return SendResponse(res, response, 200);
            }
          });
        }
      });
    }

};
/*********************
  signing up new user ends
*********************/


/*********************
 	login user
*********************/
methods.userLogin = function(req, res, next) {
	let response = {};

  //Check for any errors.
  req.checkBody('email', 'email is required.').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  let errors = req.validationErrors(true);

	if (errors) {
    response.error = true;
    response.code = 10801;
    response.errors = errors;
    response.userMessage = 'Validation errors';
    return SendResponse(res, response, 400);
  } else {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        if (err === 10901) {
          response.error = true;
          response.code = 10901;
          response.userMessage = 'There was a problem with the request, please try again.'
          response.data = null;
          response.errors = null;
          return SendResponse(res, response, 500);
        } else {
          response.error = true;
          response.code = 10901;
          response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
          response.data = null;
          response.errors = null;
          return SendResponse(res, response, 400);
        }
      } else {
        if (!user) {
          response.error = true;
          response.code = 10101; //user Doesn't exists
          response.data = null;
          response.userMessage = 'email id not registerd or incorrect password';
          return SendResponse(res, response, 403);
        } else {
          response.error = false;
          response.code = 200;
          response.userMessage = 'Thanks for logging in.';
          response.data = {
            token: info.sessionToken,
            user: user
          };
          response.errors = null;
          return SendResponse(res, response, 200);
        }
      }
    })(req, res, next);
  }
}

/*********************
 	login user ends
*********************/

/*********************
  userlogout
*********************/
methods.userlogout = function(req, res) {
  // NullResponseValue();
	let response = {};
  Session.findOneAndRemove({
      user: req.user._id
    })
    .lean()
    .exec(function(err) {
      if (err) {
        response.error = true;
        response.code = 10901;
        response.userMessage = 'There was a problem with the request, please try again.'
        return SendResponse(res, response, 500);
      } else {
        response.data = null;
        response.error = false;
        response.userMessage = 'user Logged Out successfully';
        response.code = 200;
        response.errors = null;
        return SendResponse(res, response, 200);
      }
    });
};
/*********************
  userlogout Ends
*********************/

/*********************
  getFeeds
*********************/
methods.getFeeds = async function(req, res) {
	let response = {};
	req.checkBody('link', 'link is required.').notEmpty();
	let feed = await parser.parseURL(req.body.link);
	if(feed) {
		response.data = JSON.stringify(feed);
		response.error = false;
		response.userMessage = "feed";
		response.code = 200;
		response.errors = null;
		return SendResponse(res, response, 200);
	} else {
		response.error = true;
		response.code = 10901;
		response.userMessage = 'There was a problem with the request, please try again.'
		return SendResponse(res, response, 500);
	}
};
/*********************
  getFeeds Ends
*********************/


/*********************
  getuser
*********************/
methods.getuser=function(req, res){
 response.data = {
    user: req.user
  }
  response.success = true
  response.userMessage = '';
  response.code = 200;
  response.errors = null;
  return SendResponse(res, response, 200);
}
/*********************
  getuser Ends
*********************/
