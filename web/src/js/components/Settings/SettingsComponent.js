import React from 'react'
import PropTypes from 'prop-types'

import FadeInAnimation from 'general/FadeInAnimation'

import { goTo, goToDashboard } from 'navigation/navigation'
import AppBar from 'material-ui/AppBar'
import FontIcon from 'material-ui/FontIcon'
import MenuItem from 'material-ui/MenuItem'
import Drawer from 'material-ui/Drawer'
import FlatButton from 'material-ui/FlatButton'

import { logoutUser } from '../../utils/cognito-auth'

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selection: 'widgets'
    }
  }

  componentDidMount () {
    this.setState({
      selection: this.getRouteName()
    })
  }

  getRouteName () {
    var currentPath = this.props.location.pathname
    if (currentPath[currentPath.length - 1] === '/') {
      currentPath = currentPath.slice(0, currentPath.length - 1)
    }
    var index = currentPath.lastIndexOf('/')
    return currentPath.slice(index + 1)
  }

  openSettingsFor (selection) {
    this.setState({
      selection: selection
    })

    goTo('/tab/settings/' + selection)
  }

  goToHome () {
    goToDashboard()
  }

  logout () {
    logoutUser((loggedOut) => {
      if (loggedOut) {
        this.goToLogin()
      }
    })
  }

  goToLogin () {
    goTo('/auth')
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

    const defaultMenuItem = {
    }

    const widgets = Object.assign({}, defaultMenuItem, {
      fontWeight: (this.state.selection === 'widgets' ||
        this.state.selection === 'settings') ? 'bold' : 'normal'
    })

    const background = Object.assign({}, defaultMenuItem, {
      fontWeight: (this.state.selection === 'background') ? 'bold' : 'normal'
    })

    const logoutBtn = (
      <FlatButton
        id={'app-signout-btn'}
        onClick={this.logout.bind(this)}
        label='Sign Out'
        labelPosition='before'
        icon={<FontIcon
          color={'#FFF'}
          className='fa fa-sign-out' />} />
    )

    return (
      <FadeInAnimation>
        <div
          data-test-id={'app-settings-id'}
          key={'settings-view-key'}
          style={settings}>
          <AppBar
            title='Settings'
            iconClassNameLeft='fa fa-arrow-left'
            onLeftIconButtonTouchTap={this.goToHome.bind(this)}
            iconElementRight={logoutBtn} />
          <Drawer>
            <AppBar
              title='Settings'
              iconClassNameLeft='fa fa-arrow-left'
              onLeftIconButtonTouchTap={this.goToHome.bind(this)} />
            <MenuItem
              style={widgets}
              onClick={this.openSettingsFor.bind(this, 'widgets')}>
                  Widgets
              </MenuItem>
            <MenuItem
              style={background}
              onClick={this.openSettingsFor.bind(this, 'background')}>Background</MenuItem>
          </Drawer>
          <div style={container}>
            {this.props.children}
          </div>
        </div>
      </FadeInAnimation>
    )
  }
}

Settings.propTypes = {
  user: PropTypes.object.isRequired
}

export default Settings
