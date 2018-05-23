import React from 'react'
import PropTypes from 'prop-types'
import ErrorMessage from 'general/ErrorMessage'
import {
  goToDashboard,
  backgroundSettingsURL,
  donateURL,
  inviteFriendsURL,
  statsURL,
  widgetSettingsURL
} from 'navigation/navigation'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import SettingsMenuItem from './SettingsMenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import CloseIcon from 'material-ui/svg-icons/navigation/close'

const styles = theme => ({
  flex: {
    flex: 1
  }
})

// TODO:
// - active style for menu item
// - hover style for menu item
// - subheader for sections? possibly remove title from top-left?
// - add "Account" page with email address and username
class SettingsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errorMessage: null
    }
  }

  goToHome () {
    goToDashboard()
  }

  showError (msg) {
    this.setState({
      errorMessage: msg
    })
  }

  clearError () {
    this.showError(null)
  }

  render () {
    const { classes } = this.props
    const showError = this.showError
    const errorMessage = this.state.errorMessage
    const sidebarWidth = 250
    return (
      <div
        data-test-id={'app-settings-id'}
        key={'settings-view-key'}
        style={{
          color: '#fff',
          backgroundColor: '#F2F2F2',
          minWidth: '100vw',
          minHeight: '100vh'
        }}>
        <AppBar
          color={'primary'}
          position={'sticky'}
        >
          <Toolbar>
            <Typography variant='title' color='inherit' className={classes.flex}>
              {this.props.title}
            </Typography>
            <IconButton onClick={this.goToHome.bind(this)}>
              <CloseIcon
                style={{
                  color: '#fff',
                  width: 28,
                  height: 28
                }}
              />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ width: sidebarWidth, position: 'fixed' }}>
          <List>
            <ListSubheader disableSticky>Settings</ListSubheader>
            <SettingsMenuItem
              key={'widgets'}
              to={widgetSettingsURL}>
                      Widgets
            </SettingsMenuItem>
            <SettingsMenuItem
              key={'background'}
              to={backgroundSettingsURL}>
                      Background
            </SettingsMenuItem>
            <Divider />
            <SettingsMenuItem
              key={'stats'}
              to={statsURL}>
                    Your Stats
            </SettingsMenuItem>
            <SettingsMenuItem
              key={'donate'}
              to={donateURL}>
                    Donate Hearts
            </SettingsMenuItem>
            <SettingsMenuItem
              key={'invite'}
              to={inviteFriendsURL}>
                    Invite Friends
            </SettingsMenuItem>
            <Divider />
          </List>
        </div>
        <div style={{
          marginLeft: sidebarWidth,
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center'
        }}>
          {React.Children.map(
            this.props.children,
            (child) => React.cloneElement(child, {
              showError: showError.bind(this)
            })
          )}
        </div>
        { errorMessage
          ? <ErrorMessage message={errorMessage}
            onRequestClose={this.clearError.bind(this)} />
          : null }
      </div>
    )
  }
}

SettingsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
}

export default withStyles(styles)(SettingsPage)
