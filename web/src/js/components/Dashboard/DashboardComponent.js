/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import VcUser from '../User/VcUserContainer'
import MoneyRaised from '../MoneyRaised/MoneyRaisedContainer'
import UserBackgroundImage from '../User/UserBackgroundImageContainer'
import WidgetsContainer from '../Widget/WidgetsContainer'
import InviteFriend from '../InviteFriend/InviteFriendContainer'
import Ad from '../Ad/Ad'
import UpdateVc from './UpdateVcContainer'

import { goToSettings, goToDonate } from 'navigation/navigation'

import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'
import ErrorMessage from 'general/ErrorMessage'

import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

import {
  grey300
} from 'material-ui/styles/colors'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      bkgSelectorOpened: false,
      donateDialogOpened: false,
      errorMessage: null
    }
  }

  _goToSettings () {
    goToSettings()
  }

  _goToDonate () {
    goToDonate()
  }

  changeBkgSelectorState (state) {
    this.setState({
      bkgSelectorOpened: state
    })
  }

  changeDonateDialogState (state) {
    this.setState({
      donateDialogOpened: state
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
    // Props will be null on first render.
    const { app, user } = this.props

    const content = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 'auto'
    }

    const topRightStyle = {
      main: {
        position: 'absolute',
        top: 16,
        right: 0,
        display: 'block',
        zIndex: 200
      },
      statsContainer: {
        padding: 0,
        marginRight: 18
      },
      buttonsContainer: {
        marginTop: 8,
        marginRight: 10,
        marginLeft: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      },
      iconButton: {
        padding: 0,
        width: 32,
        height: 32
      },
      icon: {
        fontSize: 20
      }
    }

    const errorMessage = this.state.errorMessage

    return (
      <div
        data-test-id={'app-dashboard-id'}
        key={'dashboard-key'}>
        <UserBackgroundImage user={user} showError={this.showError.bind(this)} />
        { user
          ? <FadeInDashboardAnimation>
            <div style={content}>
              <div style={topRightStyle.main}>
                <div style={topRightStyle.statsContainer}>
                  <MoneyRaised app={app} />
                  <VcUser user={user} />
                </div>
                <div style={topRightStyle.buttonsContainer}>
                  <IconButton
                    style={topRightStyle.iconButton}
                    iconStyle={topRightStyle.icon}
                    tooltip='Settings'
                    tooltipPosition='bottom-left'
                    onClick={this._goToSettings.bind(this)}>
                    <FontIcon
                      color={grey300}
                      hoverColor={'#FFF'}
                      className='fa fa-cog fa-lg' />
                  </IconButton>
                  <IconButton
                    style={topRightStyle.iconButton}
                    iconStyle={topRightStyle.icon}
                    tooltip='Donate'
                    tooltipPosition='top-left'
                    onClick={this._goToDonate.bind(this)}>
                    <FontIcon
                      color={grey300}
                      hoverColor={'#FFF'}
                      className='fa fa-heart fa-lg' />
                  </IconButton>
                  <InviteFriend
                    style={topRightStyle.iconButton}
                    iconStyle={topRightStyle.icon}
                    user={user} />
                </div>
              </div>
            </div>
          </FadeInDashboardAnimation>
          : null
        }
        <WidgetsContainer user={user} showError={this.showError.bind(this)} />
        <Ad
          adId='div-gpt-ad-1464385742501-0'
          adSlotId='/43865596/HBTR'
          width={300}
          height={250}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            display: 'block'
          }} />
        <Ad
          adId='div-gpt-ad-1464385677836-0'
          adSlotId='/43865596/HBTL'
          width={728}
          height={90}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 320,
            display: 'block'
          }} />
        { user ? <UpdateVc user={user} /> : null }
        { errorMessage
          ? <ErrorMessage message={errorMessage}
            onRequestClose={this.clearError.bind(this)} />
          : null }
      </div>
    )
  }
}

Dashboard.propTypes = {
  app: PropTypes.object,
  user: PropTypes.object
}

export default Dashboard
