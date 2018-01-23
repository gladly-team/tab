import React from 'react'
import { IndexRoute, IndexRedirect, Route, Redirect } from 'react-router'

import BaseContainer from 'general/BaseContainer'

import App from '../components/App/App'
import DashboardView from '../components/Dashboard/DashboardView'

import AuthenticationView from '../components/Authentication/AuthenticationView'
import FirebaseAuthenticationUI from '../components/Authentication/FirebaseAuthenticationUI'
import VerifyEmailMessage from '../components/Authentication/VerifyEmailMessage'
import EnterUsernameForm from '../components/Authentication/EnterUsernameForm'
import SignInIframeMessage from '../components/Authentication/SignInIframeMessage'
import MissingEmailMessage from '../components/Authentication/MissingEmailMessage'
import SettingsComponent from '../components/Settings/SettingsComponent'
import BackgroundSettingsView from '../components/Settings/Background/BackgroundSettingsView'
import WidgetsSettingsView from '../components/Settings/Widgets/WidgetsSettingsView'
import Profile from '../components/Settings/ProfileComponent'
import ProfileStatsView from '../components/Settings/Profile/ProfileStatsView'
import ProfileDonateHearts from '../components/Settings/Profile/ProfileDonateHeartsView'
import ProfileInviteFriend from '../components/Settings/Profile/ProfileInviteFriendView'

export default (
  // TODO: Show 404 page from IndexRedirect
  <Route path='/' component={BaseContainer}>
    <Route path='newtab' component={App}>
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
      <Route path='auth' component={AuthenticationView}>
        <IndexRoute component={FirebaseAuthenticationUI} />
        <Route path='action' component={FirebaseAuthenticationUI} />
        <Route path='verify-email' component={VerifyEmailMessage} />
        <Route path='username' component={EnterUsernameForm} />
        <Route path='welcome' component={SignInIframeMessage} />
        <Route path='missing-email' component={MissingEmailMessage} />
      </Route>
      <Redirect from='*' to='/newtab/' />
    </Route>
    <IndexRedirect from='*' to='/newtab/' />
  </Route>
)
