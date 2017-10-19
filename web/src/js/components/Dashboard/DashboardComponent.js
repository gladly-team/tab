/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import MoneyRaised from '../MoneyRaised/MoneyRaisedContainer'
import UserBackgroundImage from '../User/UserBackgroundImageContainer'
import UserMenu from '../User/UserMenuContainer'
import WidgetsContainer from '../Widget/WidgetsContainer'
import Ad from '../Ad/Ad'
import UpdateVc from './UpdateVcContainer'
import FontIcon from 'material-ui/FontIcon'
import {
  dashboardIconInactiveColor,
  dashboardIconActiveColor
} from 'theme/default'
import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'
import ErrorMessage from 'general/ErrorMessage'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      bkgSelectorOpened: false,
      donateDialogOpened: false,
      errorMessage: null
    }
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
    const { user, app } = this.props

    const errorMessage = this.state.errorMessage

    const menuStyle = {
      position: 'absolute',
      top: 14,
      right: 16,
      display: 'flex',
      justifyItems: 'flex-end',
      alignItems: 'center'
    }
    const menuTextStyle = {
      fontSize: 24
    }
    const moneyRaisedStyle = Object.assign({}, menuTextStyle)
    const bulletPointStyle = {
      alignSelf: 'center',
      fontSize: 5,
      marginTop: 2,
      marginLeft: 12,
      marginRight: 12
    }
    const userMenuStyle = Object.assign({}, menuTextStyle)

    return (
      <div
        data-test-id={'app-dashboard-id'}
        key={'dashboard-key'}>
        <UserBackgroundImage user={user} showError={this.showError.bind(this)} />
        { user
          ? (
            <FadeInDashboardAnimation>
              <div style={menuStyle}>
                <MoneyRaised app={app} style={moneyRaisedStyle} />
                <FontIcon
                  color={dashboardIconInactiveColor}
                  hoverColor={dashboardIconActiveColor}
                  style={bulletPointStyle}
                  className={'fa fa-circle'} />
                <UserMenu user={user} style={userMenuStyle} />
              </div>
            </FadeInDashboardAnimation>
            )
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
