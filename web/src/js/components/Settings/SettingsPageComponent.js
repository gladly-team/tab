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
import AppBar from '@material-ui/core/AppBar'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import SettingsMenuItem from './SettingsMenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import CloseIcon from 'material-ui/svg-icons/navigation/close'

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
    const showError = this.showError
    const errorMessage = this.state.errorMessage
    const sidebarWidth = 250
    return (
      <div
        data-test-id={'app-settings-id'}
        key={'settings-view-key'}
        style={{
          backgroundColor: '#F2F2F2',
          minWidth: '100vw',
          minHeight: '100vh'
        }}>
        <AppBar
          color={'primary'}
          position={'sticky'}
          iconElementRight={
            <IconButton
              style={{
                width: 54,
                height: 54,
                padding: 8
              }}
              iconStyle={{
                width: 28,
                height: 28
              }}
              onClick={this.goToHome.bind(this)}
            >
              <CloseIcon />
            </IconButton>
          }
        >
          <Toolbar>
            <Typography variant='title' color='inherit'>
              {this.props.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ width: sidebarWidth, position: 'fixed' }}>
          <List>
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
  title: PropTypes.string.isRequired
}

export default SettingsPage
