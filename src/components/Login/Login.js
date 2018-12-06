import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { FormGroup, ControlLabel, FormControl, Button, Col, HelpBlock } from 'react-bootstrap';
import axios from 'axios';
import { checkLogin } from 'services/common';


/*************************************************
  Login Statefull Component
**************************************************/


class Login extends Component {
  constructor(props) {
    super(props);
    //initial state
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    }
  }

  componentWillMount() {
    //check user login token
    checkLogin((err) => {
      if (!err)
        browserHistory.push('/dashboard');
    });
  }

  /***
   ** Handles state change
   ***/
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      emailError: '',
      passwordError: ''
    });
  }

  /***
   **Login form submit
   ***/
  submit = () => {
    let { email, password } = this.state;

    //state validation
    if(!email)
      return this.setState({emailError: 'Email Required'});
    if(!password)
      return this.setState({passwordError: 'Password Required'});

    //Rest login request
    axios.post('https://rss-feed-backend.herokuapp.com/api/user/session', { email, password })
    .then(response => {

      const token = response.data.data.token;
      const expireInHours = 24;
      const expiresOn = Date.now() + (expireInHours + (60 * 60 * 1000));
      const user = response.data.data.user;
      localStorage.setItem('authToken', JSON.stringify({
        token,
        expiresOn,
        user
      }));

      browserHistory.push('dashboard');
    })
    .catch(error => {
      this.setState({passwordError: error.response && error.response.data?error.response.data.userMessage:''})
    });
  }

  render() {
    const { emailError, passwordError } = this.state;

    return (
      <div className="form-component">
        <Col md={4}></Col>
        <Col md={4}className="form-box">
          <div className="form-container">
            <h3 className="form-header">ACCOUNT LOGIN</h3>
            <form>
              <FormGroup controlId="email" >
                <ControlLabel>Email Address</ControlLabel>
                <FormControl
                  type="email"
                  id="email"
                  value={this.state.email}
                  placeholder="Enter email"
                  onChange={this.handleChange}
                />
                <HelpBlock>{emailError}</HelpBlock>
              </FormGroup>
              <FormGroup controlId="password">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  id="password"
                  value={this.state.password}
                  placeholder="Enter password"
                  onChange={this.handleChange}
                />
                <HelpBlock>{passwordError}</HelpBlock>
              </FormGroup>
              <Button className="form-submit" bsStyle="primary" onClick={this.submit}>Login</Button>
            </form>
            <div className="form-info">
              <p>Already have a account? <Link to="signup">Signup</Link></p>
            </div>
          </div>

        </Col>
        <Col md={4}></Col>
      </div>
    );
  }
}

export default Login;
