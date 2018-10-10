import React from 'react'
import { IndexRoute, IndexRedirect, Route, Redirect } from 'react-router'

import BaseContainer from 'js/components/General/BaseContainer'

import App from 'js/components/App/App'
import DashboardView from 'js/components/Dashboard/DashboardView'

import AuthenticationView from 'js/components/Authentication/AuthenticationView'
import FirebaseAuthenticationUI from 'js/components/Authentication/FirebaseAuthenticationUI'
import FirebaseAuthenticationUIAction from 'js/components/Authentication/FirebaseAuthenticationUIAction'
import VerifyEmailMessage from 'js/components/Authentication/VerifyEmailMessage'
import EnterUsernameForm from 'js/components/Authentication/EnterUsernameForm'
import SignInIframeMessage from 'js/components/Authentication/SignInIframeMessage'
import MissingEmailMessage from 'js/components/Authentication/MissingEmailMessage'
import SettingsPageComponent from 'js/components/Settings/SettingsPageComponent'
import BackgroundSettingsView from 'js/components/Settings/Background/BackgroundSettingsView'
import WidgetsSettingsView from 'js/components/Settings/Widgets/WidgetsSettingsView'
import ProfileStatsView from 'js/components/Settings/Profile/ProfileStatsView'
import ProfileDonateHearts from 'js/components/Settings/Profile/ProfileDonateHeartsView'
import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendView'
import AccountView from 'js/components/Settings/Account/AccountView'
import FirstTabView from 'js/components/Dashboard/FirstTabView'
import PostUninstallView from 'js/components/Dashboard/PostUninstallView'

export default (
  // TODO: Show 404 page from IndexRedirect
  <Route path='/' component={BaseContainer}>
    <Route path='newtab' component={App}>
      <IndexRoute component={DashboardView} />
      <Route component={SettingsPageComponent}>
        <Route path='settings'>
          <IndexRoute component={WidgetsSettingsView} />
          <Route path='widgets' component={WidgetsSettingsView} />
          <Route path='background' component={BackgroundSettingsView} />
        </Route>
        <Route path='profile'>
          <IndexRoute component={ProfileStatsView} />
          <Route path='stats' component={ProfileStatsView} />
          <Route path='donate' component={ProfileDonateHearts} />
          <Route path='invite' component={ProfileInviteFriend} />
        </Route>
        <Route path='account' component={AccountView} />
      </Route>
      <Route path='first-tab'>
        <IndexRoute component={FirstTabView} />
      </Route>
      <Route path='uninstalled'>
        <IndexRoute component={PostUninstallView} />
      </Route>
      <Route path='auth' component={AuthenticationView}>
        <IndexRoute component={FirebaseAuthenticationUI} />
        <Route path='action' component={FirebaseAuthenticationUI} >
          <IndexRoute component={FirebaseAuthenticationUIAction} />
        </Route>
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
