/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import VcUser from '../User/VcUserContainer'
import MoneyRaised from '../MoneyRaised/MoneyRaisedContainer'
import UserBackgroundImage from '../User/UserBackgroundImageContainer'
import WidgetsContainer from '../Widget/WidgetsContainer'
import InviteFriend from '../InviteFriend/InviteFriendView'
import Ad from '../Ad/Ad'

import { goToSettings, goToDonate } from 'navigation/navigation'

import FadeInAnimation from 'general/FadeInAnimation'
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
    const { app, user } = this.props

    const content = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 'auto',
      backgroundColor: 'rgba(0,0,0,.2)'
    }

    const topRightItems = {
      main: {
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'flex',
        zIndex: 2147483647
      },
      leftContainer: {
        padding: 5
      },
      rightContainer: {
        marginLeft: 5,
        display: 'flex',
        flexDirection: 'column'
      }
    }

    const errorMessage = this.state.errorMessage

    return (
      <FadeInAnimation>
        <div
          data-test-id={'app-dashboard-id'}
          key={'dashboard-key'}>
          <UserBackgroundImage user={user} />
          <div style={content}>
            <div style={topRightItems.main}>
              <div style={topRightItems.leftContainer}>
                <MoneyRaised app={app} />
                <VcUser user={user} />
              </div>
              <div style={topRightItems.rightContainer}>
                <IconButton
                  tooltip='Settings'
                  tooltipPosition='bottom-left'
                  onClick={this._goToSettings.bind(this)}>
                  <FontIcon
                    color={grey300}
                    hoverColor={'#FFF'}
                    className='fa fa-cog fa-lg' />
                </IconButton>

                <IconButton
                  tooltip='Donate'
                  tooltipPosition='top-left'
                  onClick={this._goToDonate.bind(this)}>
                  <FontIcon
                    color={grey300}
                    hoverColor={'#FFF'}
                    className='fa fa-heart fa-lg' />
                </IconButton>
                <InviteFriend />
              </div>
            </div>
          </div>
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
          { errorMessage
            ? <ErrorMessage message={errorMessage}
              onRequestClose={this.clearError.bind(this)} />
            : null }
        </div>
      </FadeInAnimation>
    )
  }
}

Dashboard.propTypes = {
  app: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default Dashboard
