import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { checkLogin } from 'services/common';
import { FormGroup, ControlLabel, FormControl, Button, Col, HelpBlock } from 'react-bootstrap';
import axios from 'axios';

/*************************************************
  Signup Stateful Component
**************************************************/

class Signup extends Component {
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
   **Handles state change
   ***/
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      emailError: '',
      passwordError: ''
    });
  }

  /***
   **Signup form submit
   ***/
  submit = () => {
    let { email, password } = this.state;

    //state validation
    if(!email)
      return this.setState({emailError: 'Email Address Required'});
    if(!password)
      return this.setState({passwordError: 'Password Required'});

    //Rest signup request
    axios.post('http://localhost:8000/api/user', { email, password })
    .then(response => {
      if(!response.data.success)
        return this.setState({passwordError: response.data.userMessage});

      const expireInHours = 24;
      const expiresOn = Date.now() + (expireInHours + (60 * 60 * 1000));
      const token = response.data.data.token;
      const user = response.data.data.user;

      localStorage.setItem('authToken', JSON.stringify({
        token,
        user,
        expiresOn
      }));

      browserHistory.push('dashboard');
    })
    .catch(error => {
      this.setState({emailError: error.response.data.errors['email']?error.response.data.errors['email'].msg:''});
      this.setState({passwordError: error.response.data.errors['password']?error.response.data.errors['password'].msg:''});
    });

  }

  render() {
    const { emailError, passwordError } = this.state;

    return (
      <div className="form-component">
        <Col md={4}></Col>
        <Col md={4}className="form-box">
          <div className="form-container">
            <h3 className="form-header">ACCOUNT SIGNUP</h3>
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
              <Button className="form-submit" bsStyle="primary" onClick={this.submit}>Signup</Button>
            </form>
            <div className="form-info">
              <p>Already have a account? <Link to="login">Login</Link></p>
            </div>
          </div>
        </Col>
        <Col md={4}></Col>
      </div>
    );
  }
}

export default Signup;
