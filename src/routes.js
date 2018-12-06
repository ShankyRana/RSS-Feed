import React from 'react';
import { Router, Route } from 'react-router';
import {
  Dashboard,
  Signup,
  Login
} from 'components';

const MyRoutes = ({routerHistory}) => (
  <Router history={routerHistory}>
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="*" component={Login} />
  </Router>
);

export default MyRoutes;
