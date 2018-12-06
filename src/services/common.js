import moment from 'moment';
import { browserHistory } from 'react-router';

/*************************************************
  Commonly used methods
**************************************************/


/***
 **Get user token from cookie
 ***/
 export const checkLogin = (callback) => {
  const cookie = localStorage.getItem('authToken');
  const authToken = cookie
    ? JSON.parse(cookie)
    : null;
  if (authToken) {
    checkTokenExists(authToken);
    callback(null, authToken.token);
  } else {
    callback('not logged in');
  }
}

/***
 **Validate token expiry
 ***/
export const checkTokenExists = (action) => {
  const token = action.token;
  try {
    if (token) {
      if(moment().isAfter(moment(token.expiresOn)))
        return logout();
      return true;
    }
    logout();
  } catch(error) {
    console.log(error);
  }
}

/***
 **Logout user
 ***/
export const logout = () => {
  localStorage.setItem('authToken', null);
  browserHistory.push('/login');
}
