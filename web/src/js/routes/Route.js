import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';
import userWrapper from '../wrappers/userWrapper';

import ViewerQuery from './ViewerQuery';
import AppContainer from '../components/App/AppContainer';
import DashboardContainer from '../components/Dashboard/DashboardContainer';
import CharitiesContainer from '../components/Charity/CharitiesContainer';
import UserDisplayContainer from '../components/User/UserDisplayContainer';
import DonateVcContainer from '../components/Donate/DonateVcContainer';
import BackgroundImagePickerContainer from '../components/BackgroundImage/BackgroundImagePickerContainer';
// import FeatureContainer from '../components/Feature/FeatureContainer';
// import SignupComponent from '../components/Signup/SignupComponent';
// import LoginComponent from '../components/Login/LoginComponent';

export default (
  <Route path='/' component={AppContainer} queries={ViewerQuery}>
    <IndexRoute component={userWrapper(DashboardContainer)} queries={ViewerQuery}/>
    <Route path='/charities' component={CharitiesContainer} queries={ViewerQuery}/>
    <Route path='/donate' component={DonateVcContainer} queries={ViewerQuery}/>
    <Route path='/background' component={BackgroundImagePickerContainer} queries={ViewerQuery}/>
    <Redirect from='*' to='/' />
  </Route>
);

// export default (
//   <Route path='/' component={AppContainer} queries={ViewerQuery}>
//     <IndexRoute component={CharitiesContainer} queries={ViewerQuery}/>
//     <Route path='/user' component={userWrapper(UserDisplayContainer)} queries={ViewerQuery}/>
//     <Redirect from='*' to='/' />
//   </Route>
// );

// <Route path='/signup' component={SignupComponent} />
// <Route path='/login' component={LoginComponent} />

