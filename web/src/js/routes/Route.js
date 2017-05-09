import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import AppView from '../components/App/AppView';
import DashboardView from '../components/Dashboard/DashboardView';
import CharitiesView from '../components/Charity/CharitiesView';

import DonateVcView from '../components/Donate/DonateVcView';

import SettingsView from '../components/Settings/SettingsView';
import BackgroundSettingsView from '../components/Settings/Background/BackgroundSettingsView';
import WidgetsSettingsView from '../components/Settings/Widgets/WidgetsSettingsView';

export default (
  <Route path='/' component={AppView}>
    <IndexRoute component={DashboardView}/>
    <Route path='donate' component={DonateVcView}/>
    <Route path='settings' component={SettingsView}>
    	<IndexRoute component={WidgetsSettingsView}/>
    	<Route path='widgets' component={WidgetsSettingsView}/>
    	<Route path='background' component={BackgroundSettingsView}/>
    </Route>
    <Redirect from='*' to='/' />
  </Route>
);

// <Route path='/charities' component={CharitiesContainer} queries={ViewerQuery}/>
// <Route path='/donate' component={DonateVcContainer} queries={ViewerQuery}/>
// <Route path='/background' component={BackgroundImagePickerContainer} queries={ViewerQuery}/>
    // <Route path='charities' component={CharitiesView}/>
