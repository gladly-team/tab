import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import ErrorMessage from 'js/components/General/ErrorMessage'
import {
  goToDashboard,
  accountURL,
  backgroundSettingsURL,
  donateURL,
  inviteFriendsURL,
  statsURL,
  widgetSettingsURL,
} from 'js/navigation/navigation'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import SettingsMenuItem from 'js/components/Settings/SettingsMenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Logo from 'js/components/Logo/Logo'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import BackgroundSettingsView from 'js/components/Settings/Background/BackgroundSettingsView'
import WidgetsSettingsView from 'js/components/Settings/Widgets/WidgetsSettingsView'
import ProfileStatsView from 'js/components/Settings/Profile/ProfileStatsView'
import ProfileDonateHearts from 'js/components/Settings/Profile/ProfileDonateHeartsView'
import ProfileInviteFriend from 'js/components/Settings/Profile/ProfileInviteFriendView'
import AccountView from 'js/components/Settings/Account/AccountView'

const styles = theme => ({
  listSubheader: {
    paddingLeft: 14,
  },
})

class SettingsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: null,
    }
  }

  goToHome() {
    goToDashboard()
  }

  showError(msg) {
    this.setState({
      errorMessage: msg,
    })
  }

  clearError() {
    this.showError(null)
  }

  render() {
    const { classes } = this.props
    const showError = this.showError
    const errorMessage = this.state.errorMessage
    const sidebarWidth = 240
    const sidebarLeftMargin = 10
    return (
      <div
        data-test-id={'app-settings-id'}
        key={'settings-view-key'}
        style={{
          color: '#fff',
          backgroundColor: '#F2F2F2',
          minWidth: '100vw',
          minHeight: '100vh',
        }}
      >
        <AppBar color={'primary'} position={'sticky'}>
          <Toolbar>
            <div style={{ flex: 1 }}>
              <Logo color={'white'} />
            </div>
            <IconButton onClick={this.goToHome.bind(this)}>
              <CloseIcon
                style={{
                  color: '#fff',
                  width: 28,
                  height: 28,
                }}
              />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ width: sidebarWidth, position: 'fixed' }}>
          <List style={{ marginLeft: sidebarLeftMargin }}>
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
        </div>
        <div
          style={{
            marginLeft: sidebarWidth,
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Switch>
            <Route
              exact
              path="/newtab/settings/widgets"
              render={props => (
                <WidgetsSettingsView
                  {...props}
                  showError={showError.bind(this)}
                />
              )}
            />

            <Route
              exact
              path="/newtab/settings/background"
              render={props => (
                <BackgroundSettingsView
                  {...props}
                  showError={showError.bind(this)}
                />
              )}
            />
            <Route
              exact
              path="/newtab/profile/stats"
              render={props => (
                <ProfileStatsView {...props} showError={showError.bind(this)} />
              )}
            />
            <Route
              exact
              path="/newtab/profile/donate"
              render={props => (
                <ProfileDonateHearts
                  {...props}
                  showError={showError.bind(this)}
                />
              )}
            />
            <Route
              exact
              path="/newtab/profile/invite"
              render={props => (
                <ProfileInviteFriend
                  {...props}
                  showError={showError.bind(this)}
                />
              )}
            />
            <Route
              exact
              path="/newtab/account"
              render={props => (
                <AccountView {...props} showError={showError.bind(this)} />
              )}
            />
            {/* Redirect any incorrect paths */}
            <Redirect
              from="/newtab/settings/*"
              to="/newtab/settings/widgets/"
            />
            <Redirect from="/newtab/profile/*" to="/newtab/profile/stats/" />
            <Redirect from="/newtab/account/*" to="/newtab/account/" />
          </Switch>
        </div>
        {errorMessage ? (
          <ErrorMessage
            message={errorMessage}
            onRequestClose={this.clearError.bind(this)}
          />
        ) : null}
      </div>
    )
  }
}

SettingsPage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SettingsPage)
