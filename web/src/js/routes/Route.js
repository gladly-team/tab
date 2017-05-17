import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import BaseContainer from 'general/BaseContainer';

import AppView from '../components/App/AppView';
import DashboardView from '../components/Dashboard/DashboardView';
import Authentication from '../components/Authentication/Authentication';

import DonateVcView from '../components/Donate/DonateVcView';

import SettingsView from '../components/Settings/SettingsView';
import BackgroundSettingsView from '../components/Settings/Background/BackgroundSettingsView';
import WidgetsSettingsView from '../components/Settings/Widgets/WidgetsSettingsView';

import CreateUserView from '../components/User/CreateUserView';

export default (
  <Route path='/' component={BaseContainer}>
    <IndexRoute component={Authentication}/>
    <Route path='auth' component={Authentication}/>
    <Route path='new-user' component={CreateUserView}/>
    <Route path='app' component={AppView}>
        <IndexRoute component={DashboardView}/>
        <Route path='donate' component={DonateVcView}/>
        <Route path='settings' component={SettingsView}>
            <IndexRoute component={WidgetsSettingsView}/>
            <Route path='widgets' component={WidgetsSettingsView}/>
            <Route path='background' component={BackgroundSettingsView}/>
        </Route>
    </Route>
    <Redirect from='*' to='/' />
  </Route>
  
);
