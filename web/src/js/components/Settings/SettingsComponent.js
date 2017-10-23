import React from 'react'
import FadeInAnimation from 'general/FadeInAnimation'
import ErrorMessage from 'general/ErrorMessage'
import {
  goToDashboard,
  goToLogin
} from 'navigation/navigation'
import AppBar from 'material-ui/AppBar'
import FontIcon from 'material-ui/FontIcon'
import Drawer from 'material-ui/Drawer'
import FlatButton from 'material-ui/FlatButton'
import SettingsMenuItem from './SettingsMenuItem'
import { logoutUser } from '../../utils/cognito-auth'
import appTheme from 'theme/default'

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errorMessage: null
    }
  }

  goToHome () {
    goToDashboard()
  }

  logout () {
    logoutUser((loggedOut) => {
      if (loggedOut) {
        goToLogin()
      }
    })
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
    const settings = {
      backgroundColor: '#F2F2F2',
      width: '100%',
      height: '100%'
    }
    const container = {
      backgroundColor: '#F2F2F2',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center'
    }
    const logoutContainer = {
      position: 'absolute',
      bottom: 20,
      left: 60
    }
    const logoutBtn = (
      <FlatButton
        id={'app-signout-btn'}
        onClick={this.logout.bind(this)}
        label='Sign Out'
        labelPosition='before'
        style={{color: appTheme.palette.accent1Color}}
        icon={<FontIcon
          color={appTheme.palette.accent1Color}
          className='fa fa-sign-out' />} />
    )

    const showError = this.showError
    const errorMessage = this.state.errorMessage

    return (
      <FadeInAnimation>
        <div
          data-test-id={'app-settings-id'}
          key={'settings-view-key'}
          style={settings}>
          <AppBar
            title='Settings'
            iconClassNameLeft='fa fa-arrow-left'
            onLeftIconButtonTouchTap={this.goToHome.bind(this)} />
          <Drawer>
            <AppBar
              title='Settings'
              iconClassNameLeft='fa fa-arrow-left'
              onLeftIconButtonTouchTap={this.goToHome.bind(this)} />
            <SettingsMenuItem
              to={'/tab/settings/widgets/'}>
                Widgets
            </SettingsMenuItem>
            <SettingsMenuItem
              to={'/tab/settings/background/'}>
                Background
            </SettingsMenuItem>
            <div style={logoutContainer}>
              {logoutBtn}
            </div>
          </Drawer>
          <div style={container}>
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
      </FadeInAnimation>
    )
  }
}

export default Settings
