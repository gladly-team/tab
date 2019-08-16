import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'

import AccountView from 'js/components/Settings/Account/AccountView'
import BackgroundSettingsView from 'js/components/Settings/Background/BackgroundSettingsView'
import ProfileStatsView from 'js/components/Settings/Profile/ProfileStatsView'
import ProfileDonateHearts from 'js/components/Settings/Profile/ProfileDonateHeartsView'
import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendView'
import SettingsMenuItem from 'js/components/Settings/SettingsMenuItem'
import SettingsPage from 'js/components/Settings/SettingsPageComponent'
import WidgetsSettingsView from 'js/components/Settings/Widgets/WidgetsSettingsView'
import withUser from 'js/components/General/withUser'
import {
  goTo,
  accountURL,
  backgroundSettingsURL,
  dashboardURL,
  donateURL,
  inviteFriendsURL,
  statsURL,
  widgetSettingsURL,
} from 'js/navigation/navigation'

const styles = theme => ({
  list: {
    marginLeft: 10,
  },
  listSubheader: {
    paddingLeft: 14,
  },
})

const TabSettingsPage = props => {
  const { authUser, classes } = props
  return (
    <SettingsPage
      onClose={() => {
        goTo(dashboardURL)
      }}
      sidebarContent={({ showError }) => (
        <List className={classes.listSubheader}>
          <ListSubheader disableSticky className={classes.listSubheader}>
            Settings
          </ListSubheader>
          <SettingsMenuItem key={'widgets'} to={widgetSettingsURL}>
            Widgets
          </SettingsMenuItem>
          <SettingsMenuItem key={'background'} to={backgroundSettingsURL}>
            Background
          </SettingsMenuItem>
          <Divider />
          <ListSubheader disableSticky className={classes.listSubheader}>
            Your Profile
          </ListSubheader>
          <SettingsMenuItem key={'stats'} to={statsURL}>
            Your Stats
          </SettingsMenuItem>
          <SettingsMenuItem key={'donate'} to={donateURL}>
            Donate Hearts
          </SettingsMenuItem>
          <SettingsMenuItem key={'invite'} to={inviteFriendsURL}>
            Invite Friends
          </SettingsMenuItem>
          <Divider />
          <SettingsMenuItem key={'account'} to={accountURL}>
            Account
          </SettingsMenuItem>
        </List>
      )}
      mainContent={({ showError }) => (
        <Switch>
          <Route
            exact
            path="/newtab/settings/widgets/"
            render={props => (
              <WidgetsSettingsView
                {...props}
                authUser={authUser}
                showError={showError}
              />
            )}
          />

          <Route
            exact
            path="/newtab/settings/background/"
            render={props => (
              <BackgroundSettingsView
                {...props}
                authUser={authUser}
                showError={showError}
              />
            )}
          />
          <Route
            exact
            path="/newtab/profile/stats/"
            render={props => (
              <ProfileStatsView
                {...props}
                authUser={authUser}
                showError={showError}
              />
            )}
          />
          <Route
            exact
            path="/newtab/profile/donate/"
            render={props => (
              <ProfileDonateHearts
                {...props}
                authUser={authUser}
                showError={showError}
              />
            )}
          />
          <Route
            exact
            path="/newtab/profile/invite/"
            render={props => (
              <ProfileInviteFriend
                {...props}
                authUser={authUser}
                showError={showError}
              />
            )}
          />
          <Route
            exact
            path="/newtab/account/"
            render={props => (
              <AccountView
                {...props}
                authUser={authUser}
                showError={showError}
              />
            )}
          />
          {/* Redirect any incorrect paths */}
          <Redirect from="/newtab/settings/*" to="/newtab/settings/widgets/" />
          <Redirect from="/newtab/profile/*" to="/newtab/profile/stats/" />
          <Redirect from="/newtab/account/*" to="/newtab/account/" />
        </Switch>
      )}
    />
  )
}

TabSettingsPage.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(withUser()(TabSettingsPage))
