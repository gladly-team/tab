/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import MoneyRaised from '../MoneyRaised/MoneyRaisedContainer'
import UserBackgroundImage from '../User/UserBackgroundImageContainer'
import UserMenu from '../User/UserMenuContainer'
import WidgetsContainer from '../Widget/WidgetsContainer'
import CampaignBaseContainer from '../Campaign/CampaignBaseContainer'
import Ad from '../Ad/Ad'
import LogTab from './LogTabContainer'
import LogRevenue from './LogRevenueContainer'
import LogAccountCreation from './LogAccountCreationContainer'
import CircleIcon from 'material-ui/svg-icons/image/lens'
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
      zIndex: 1,
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
      width: 5,
      height: 5,
      marginTop: 2,
      marginLeft: 12,
      marginRight: 12
    }
    const userMenuStyle = Object.assign({}, menuTextStyle)

    // Whether or not a campaign should show on the dashboard
    // TODO: also make sure the user hasn't dismissed the campaign (`isCampaignShown` var)
    const isGlobalCampaignLive = !!((app && app.isGlobalCampaignLive))

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: 'hidden'
        }}
        data-test-id={'app-dashboard-id'}
        key={'dashboard-key'}>
        <UserBackgroundImage user={user} showError={this.showError.bind(this)} />
        { user
          ? (
            <FadeInDashboardAnimation>
              <div style={menuStyle}>
                <MoneyRaised app={app} style={moneyRaisedStyle} />
                <CircleIcon
                  color={dashboardIconInactiveColor}
                  hoverColor={dashboardIconActiveColor}
                  style={bulletPointStyle}
                />
                <UserMenu app={app} user={user} style={userMenuStyle} />
              </div>
            </FadeInDashboardAnimation>
            )
          : null
        }
        <WidgetsContainer
          user={user}
          isCampaignLive={isGlobalCampaignLive}
          showError={this.showError.bind(this)}
          />
        { user
          ? (
            <FadeInDashboardAnimation>
              <CampaignBaseContainer
                user={user}
                isCampaignLive={isGlobalCampaignLive}
                />
            </FadeInDashboardAnimation>
            )
          : null
        }
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
        { user ? <LogTab user={user} /> : null }
        { user ? <LogRevenue user={user} /> : null }
        { user ? <LogAccountCreation user={user} /> : null }
        { errorMessage
          ? <ErrorMessage message={errorMessage}
            onRequestClose={this.clearError.bind(this)} />
          : null }
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  app: PropTypes.shape({
    isGlobalCampaignLive: PropTypes.bool
  })
}

Dashboard.defaultProps = {
  app: {
    isGlobalCampaignLive: false
  }
}

export default Dashboard
