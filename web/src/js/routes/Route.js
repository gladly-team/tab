import React from 'react'
import { IndexRoute, IndexRedirect, Route, Redirect } from 'react-router'

import BaseContainer from 'general/BaseContainer'

import App from '../components/App/App'
import DashboardView from '../components/Dashboard/DashboardView'

import Authentication from '../components/Authentication/Authentication'
import PasswordRetrieve from '../components/Authentication/PasswordRetrieve'

import DonateVcView from '../components/Donate/DonateVcView'
import SettingsComponent from '../components/Settings/SettingsComponent'
import BackgroundSettingsView from '../components/Settings/Background/BackgroundSettingsView'
import WidgetsSettingsView from '../components/Settings/Widgets/WidgetsSettingsView'

export default (
  <Route path='/' component={BaseContainer}>
    <Route path='tab' component={App}>
      <IndexRoute component={DashboardView} />
      <Route path='donate' component={DonateVcView} />
      <Route path='settings' component={SettingsComponent}>
        <IndexRoute component={WidgetsSettingsView} />
        <Route path='widgets' component={WidgetsSettingsView} />
        <Route path='background' component={BackgroundSettingsView} />
      </Route>
      <Route path='auth' component={BaseContainer}>
        <IndexRoute component={Authentication} />
        <Route path='login' component={Authentication} />
        <Route path='recovery' component={PasswordRetrieve} />
      </Route>
      <Redirect from='*' to='/tab/' />
    </Route>
    <IndexRedirect from='*' to='/tab/' />
  </Route>
)
