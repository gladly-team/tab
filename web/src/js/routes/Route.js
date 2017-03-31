import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import ViewerQuery from './ViewerQuery';
import AppContainer from '../components/App/AppContainer';
import DashboardContainer from '../components/Dashboard/DashboardContainer';

// import FeatureContainer from '../components/Feature/FeatureContainer';
// import SignupComponent from '../components/Signup/SignupComponent';
// import LoginComponent from '../components/Login/LoginComponent';

export default (
  <Route path='/' component={AppContainer} queries={ViewerQuery}>
    <IndexRoute component={DashboardContainer} queries={ViewerQuery}/>
    <Redirect from='*' to='/' />
  </Route>
);

// <Route path='/signup' component={SignupComponent} />
// <Route path='/login' component={LoginComponent} />

