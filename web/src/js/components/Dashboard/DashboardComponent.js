/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import VcUser from '../User/VcUserContainer'
import UserBackgroundImage from '../User/UserBackgroundImageContainer'
import WidgetsView from '../Widget/WidgetsView'
import InviteFriend from '../InviteFriend/InviteFriendView'
import Ad from '../Ad/Ad'

import { FormattedMessage } from 'react-intl'
import { goToSettings, goToDonate } from 'navigation/navigation'

import FadeInAnimation from 'general/FadeInAnimation'

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
      donateDialogOpened: false
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

  render () {
    const { user } = this.props

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

    const actioBtnContainer = {
      position: 'absolute',
      bottom: 10,
      display: 'flex',
      justifyContent: 'space-around'
    }

    const quote = {
      position: 'absolute',
      bottom: 10,
      color: 'white',
      fontSize: '1em',
      fontWeight: 'normal',
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      width: '100%',
      textAlign: 'center',
      marginLeft: 'auto',
      marginRight: 'auto'
    }

    const paddingDiv = {
      width: 20
    }

    return (
      <FadeInAnimation>
        <div key={'dashboard-key'}>
          <UserBackgroundImage user={user} />
          <div style={content}>
            <VcUser user={user} />
          </div>
          <WidgetsView />
          <div style={actioBtnContainer}>
            <div style={paddingDiv} />
            <IconButton
              tooltip='Settings'
              tooltipPosition='top-center'
              onClick={this._goToSettings.bind(this)}>
              <FontIcon
                color={grey300}
                hoverColor={'#FFF'}
                className='fa fa-cog fa-lg' />
            </IconButton>

            <IconButton
              tooltip='Donate'
              tooltipPosition='top-center'
              onClick={this._goToDonate.bind(this)}>
              <FontIcon
                color={grey300}
                hoverColor={'#FFF'}
                className='fa fa-heart fa-lg' />
            </IconButton>
            <InviteFriend />
          </div>
          <h1 style={quote}>
            <FormattedMessage
              id={'app.quote'}
              defaultMessage={'“Surf the web, save the world.”'} />
          </h1>
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
        </div>
      </FadeInAnimation>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired
}

export default Dashboard
