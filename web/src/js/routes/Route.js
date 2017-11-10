import React from 'react'
import { IndexRoute, IndexRedirect, Route, Redirect } from 'react-router'

import BaseContainer from 'general/BaseContainer'

import App from '../components/App/App'
import DashboardView from '../components/Dashboard/DashboardView'

import Authentication from '../components/Authentication/Authentication'
import SettingsComponent from '../components/Settings/SettingsComponent'
import BackgroundSettingsView from '../components/Settings/Background/BackgroundSettingsView'
import WidgetsSettingsView from '../components/Settings/Widgets/WidgetsSettingsView'
import Profile from '../components/Settings/ProfileComponent'
import ProfileStatsView from '../components/Settings/Profile/ProfileStatsView'
import ProfileDonateHearts from '../components/Settings/Profile/ProfileDonateHeartsView'
import ProfileInviteFriend from '../components/Settings/Profile/ProfileInviteFriendView'

export default (
  <Route path='/' component={BaseContainer}>
    <Route path='tab' component={App}>
      <IndexRoute component={DashboardView} />
      <Route path='settings' component={SettingsComponent}>
        <IndexRoute component={WidgetsSettingsView} />
        <Route path='widgets' component={WidgetsSettingsView} />
        <Route path='background' component={BackgroundSettingsView} />
      </Route>
      <Route path='profile' component={Profile}>
        <IndexRoute component={ProfileStatsView} />
        <Route path='stats' component={ProfileStatsView} />
        <Route path='donate' component={ProfileDonateHearts} />
        <Route path='invite' component={ProfileInviteFriend} />
      </Route>
      <Route path='auth' component={Authentication}>
        <IndexRoute component={Authentication} />
      </Route>
      <Redirect from='*' to='/tab/' />
    </Route>
    <IndexRedirect from='*' to='/tab/' />
  </Route>
)
