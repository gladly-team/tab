import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import AppHomeRoute from './AppHomeRoute';
import App from '../components/App';
// import FeatureContainer from '../components/Feature/FeatureContainer';
// import SignupComponent from '../components/Signup/SignupComponent';
// import LoginComponent from '../components/Login/LoginComponent';

export default (
  <Route path='/' component={App} queries={AppHomeRoute}>
    <IndexRoute component={App} queries={AppHomeRoute} />
    <Redirect from='*' to='/' />
  </Route>
);
