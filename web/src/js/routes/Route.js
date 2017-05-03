import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import App from '../components/App/AppComponent';
import DashboardView from '../components/Dashboard/DashboardView';
import CharitiesView from '../components/Charity/CharitiesView';
import SettingsView from '../components/Settings/SettingsView';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={DashboardView}/>
    <Route path='/charities' component={CharitiesView}/>
    <Route path='/settings' component={SettingsView}/>
    <Redirect from='*' to='/' />
  </Route>
);

// <Route path='/charities' component={CharitiesContainer} queries={ViewerQuery}/>
// <Route path='/donate' component={DonateVcContainer} queries={ViewerQuery}/>
// <Route path='/background' component={BackgroundImagePickerContainer} queries={ViewerQuery}/>
