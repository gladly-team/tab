/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import moment from 'moment'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MoneyRaised from '../MoneyRaised/MoneyRaisedContainer'
import UserBackgroundImage from '../User/UserBackgroundImageContainer'
import UserMenu from '../User/UserMenuContainer'
import WidgetsContainer from '../Widget/WidgetsContainer'
import CampaignBaseContainer from '../Campaign/CampaignBaseContainer'
import Ad from '../Ad/Ad'
import LogTab from './LogTabContainer'
import LogRevenue from './LogRevenueContainer'
import LogConsentData from './LogConsentDataContainer'
import LogAccountCreation from './LogAccountCreationContainer'
import CircleIcon from 'material-ui/svg-icons/image/lens'
import {
  dashboardIconInactiveColor,
  dashboardIconActiveColor
} from 'theme/default'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import ErrorMessage from 'js/components/General/ErrorMessage'
import Fireworks from 'lib/fireworks-react'
import RaisedButton from 'material-ui/RaisedButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import NewUserTour from 'js/components/Dashboard/NewUserTourContainer'
import { getCurrentUser } from 'authentication/user'
import localStorageMgr from 'utils/localstorage-mgr'
import { STORAGE_NEW_USER_HAS_COMPLETED_TOUR } from '../../constants'
import {
  goTo,
  loginURL
} from 'js/navigation/navigation'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      errorMessage: null,
      tabId: uuid(),
      showFireworks: false,
      isUserAnonymous: false, // Set after mount if true
      // This may be false if the user cleared their storage,
      // which is why we only show the tour to recently-joined
      // users.
      userAlreadyViewedNewUserTour: localStorageMgr.getItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR) === 'true'
    }
  }

  componentDidMount () {
    this.determineAnonymousStatus()
  }

  /**
   * Check if the user is anonymous and update state with the
   * anonymous status.
   * @return {Promise<undefined>} A Promise that resolves after
   *   the state has been updated.
   */
  async determineAnonymousStatus () {
    const currentUser = await getCurrentUser()
    const isAnon = currentUser && currentUser.isAnonymous
    return new Promise((resolve, reject) => {
      this.setState({
        isUserAnonymous: isAnon
      }, () => {
        resolve()
      })
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

  launchFireworks (show) {
    this.setState({
      showFireworks: show
    })
  }

  render () {
    // Props will be null on first render.
    const { user, app } = this.props
    const { tabId } = this.state
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

    // Show the tour if the user joined recently and localStorage
    // does not have a flag marking the tour as already viewed.
    const showNewUserTour = (
      user &&
      moment().utc().diff(moment(user.joined), 'hours') < 2 &&
      !this.state.userAlreadyViewedNewUserTour
    )

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
                <MoneyRaised
                  app={app}
                  style={moneyRaisedStyle}
                  launchFireworks={this.launchFireworks.bind(this)}
                />
                <CircleIcon
                  color={dashboardIconInactiveColor}
                  hoverColor={dashboardIconActiveColor}
                  style={bulletPointStyle}
                />
                <UserMenu
                  app={app}
                  user={user}
                  style={userMenuStyle}
                  isUserAnonymous={this.state.isUserAnonymous}
                />
              </div>
            </FadeInDashboardAnimation>
          )
          : null
        }
        { (this.state.isUserAnonymous && user)
          ? (
            <FadeInDashboardAnimation>
              <div
                data-test-id={'anon-sign-in-prompt-dashboard'}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: 14
                }}
              >
                <Paper>
                  <div
                    style={{
                      padding: '6px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      background: dashboardIconInactiveColor
                    }}
                  >
                    <Typography variant={'body1'}>
                      Sign in to save your progress!
                    </Typography>
                    <Button
                      color={'primary'}
                      style={{
                        marginLeft: 10,
                        marginRight: 10
                      }}
                      onClick={() => {
                        goTo(loginURL, { noredirect: 'true' })
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                </Paper>
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
        {
          this.state.showFireworks ? (
            <span>
              <FadeInDashboardAnimation>
                <CloseIcon
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    zIndex: 22,
                    height: 32,
                    width: 32,
                    color: '#FFF',
                    cursor: 'pointer'
                  }}
                  onClick={() => { this.launchFireworks(false) }}
                />
              </FadeInDashboardAnimation>
              <FadeInDashboardAnimation>
                <span
                  style={{
                    position: 'absolute',
                    zIndex: 21,
                    color: '#FFF',
                    top: 14,
                    left: 14,
                    width: 240,
                    fontSize: 18,
                    lineHeight: '110%'
                  }}
                >
                  <div>
                    Tabbers, together we've raised over half a million dollars for charity. Congrats, and thank you!
                  </div>
                  <a
                    href='https://www.facebook.com/notes/tab-for-a-cause/500000-raised-for-charity/1752143718162041/'
                    target='_top'
                  >
                    <RaisedButton
                      label='Share This Milestone'
                      style={{
                        marginTop: 8
                      }}
                      primary
                    />
                  </a>
                </span>
              </FadeInDashboardAnimation>
              <Fireworks
                width={window.innerWidth}
                height={window.innerHeight}
                background={'rgba(0, 0, 0, 0.01)'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 20
                }}
              />
            </span>
          )
            : null
        }
        { showNewUserTour ? <NewUserTour user={user} /> : null }
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
        { user && tabId ? <LogTab user={user} tabId={tabId} /> : null }
        { user && tabId ? <LogRevenue user={user} tabId={tabId} /> : null }
        { user ? <LogConsentData user={user} /> : null }
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
    id: PropTypes.string.isRequired,
    joined: PropTypes.string.isRequired
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
