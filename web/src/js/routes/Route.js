import React from 'react'
import { IndexRoute, Route, Redirect } from 'react-router'

import BaseContainer from 'general/BaseContainer'
import DownloadApp from 'general/DownloadApp'

import App from '../components/App/App'
import Dashboard from '../components/Dashboard/DashboardComponent'

import Authentication from '../components/Authentication/Authentication'
import PasswordRetrieve from '../components/Authentication/PasswordRetrieve'

import DonateVcView from '../components/Donate/DonateVcView'
import SettingsView from '../components/Settings/SettingsView'
import BackgroundSettingsView from '../components/Settings/Background/BackgroundSettingsView'
import WidgetsSettingsView from '../components/Settings/Widgets/WidgetsSettingsView'

export default (
  <Route path='/' component={BaseContainer}>
    <Route path='get-tab' component={DownloadApp} />
    <IndexRoute component={Authentication} />
    <Route path='auth' component={BaseContainer}>
      <IndexRoute component={Authentication} />
      <Route path='login' component={Authentication} />
      <Route path='recovery' component={PasswordRetrieve} />
    </Route>
    <Route path='tab' component={App}>
      <IndexRoute component={Dashboard} />
      <Route path='donate' component={DonateVcView} />
      <Route path='settings' component={SettingsView}>
        <IndexRoute component={WidgetsSettingsView} />
        <Route path='widgets' component={WidgetsSettingsView} />
        <Route path='background' component={BackgroundSettingsView} />
      </Route>
    </Route>
    <Redirect from='*' to='/' />
  </Route>

)
