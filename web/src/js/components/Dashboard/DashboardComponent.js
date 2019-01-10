/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import moment from 'moment'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import UserBackgroundImage from 'js/components/User/UserBackgroundImageContainer'
import UserMenu from 'js/components/User/UserMenuContainer'
import WidgetsContainer from 'js/components/Widget/WidgetsContainer'
import CampaignBase from 'js/components/Campaign/CampaignBase'
import Ad from 'js/components/Ad/Ad'
import LogTab from 'js/components/Dashboard/LogTabContainer'
import LogRevenue from 'js/components/Dashboard/LogRevenueContainer'
import LogConsentData from 'js/components/Dashboard/LogConsentDataContainer'
import LogAccountCreation from 'js/components/Dashboard/LogAccountCreationContainer'
import AssignExperimentGroups from 'js/components/Dashboard/AssignExperimentGroupsContainer'
import CircleIcon from 'material-ui/svg-icons/image/lens'
import HeartIcon from 'material-ui/svg-icons/action/favorite'
import {
  primaryColor,
  dashboardIconInactiveColor,
  dashboardIconActiveColor
} from 'js/theme/default'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import ErrorMessage from 'js/components/General/ErrorMessage'
import Fireworks from 'lib/fireworks-react'
import RaisedButton from 'material-ui/RaisedButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import NewUserTour from 'js/components/Dashboard/NewUserTourContainer'
import Notification from 'js/components/Dashboard/NotificationComponent'
import { getCurrentUser } from 'js/authentication/user'
import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  setUserDismissedAdExplanation
} from 'js/utils/local-user-data-mgr'
import { STORAGE_NEW_USER_HAS_COMPLETED_TOUR } from 'js/constants'
import {
  goTo,
  loginURL
} from 'js/navigation/navigation'
import {
  getNumberOfAdsToShow,
  shouldShowAdExplanation,
  VERTICAL_AD_SLOT_DOM_ID,
  SECOND_VERTICAL_AD_SLOT_DOM_ID,
  HORIZONTAL_AD_SLOT_DOM_ID
} from 'js/ads/adSettings'

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
      userAlreadyViewedNewUserTour: localStorageMgr.getItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR) === 'true',
      numAdsToShow: getNumberOfAdsToShow(),
      showAdExplanation: shouldShowAdExplanation()
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

    // Whether to show a global announcement.
    const showNotification = true

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflowY: 'hidden',
          overflowX: 'auto',
          // Otherwise, campaigns can cover up bookmarks.
          minWidth: 1080
        }}
        data-test-id={'app-dashboard'}
        key={'dashboard-key'}>
        <UserBackgroundImage user={user} showError={this.showError.bind(this)} />
        { user
          ? (
            <FadeInDashboardAnimation>
              <div style={{
                position: 'fixed',
                zIndex: 10,
                top: 14,
                right: 16,
                display: 'flex',
                justifyItems: 'flex-end',
                alignItems: 'center'
              }}>
                <MoneyRaised
                  app={app}
                  style={{
                    fontSize: 24
                  }}
                  launchFireworks={this.launchFireworks.bind(this)}
                />
                <CircleIcon
                  color={dashboardIconInactiveColor}
                  hoverColor={dashboardIconActiveColor}
                  style={{
                    alignSelf: 'center',
                    width: 5,
                    height: 5,
                    marginTop: 2,
                    marginLeft: 12,
                    marginRight: 12
                  }}
                />
                <UserMenu
                  app={app}
                  user={user}
                  style={{
                    fontSize: 24
                  }}
                  isUserAnonymous={this.state.isUserAnonymous}
                />
              </div>
            </FadeInDashboardAnimation>
          )
          : null
        }
        { showNotification
          ? (
            <Notification
              title={'Message Title'}
              message={`Here is some additional information about why we're notifying you.`}
              buttonText={'Click Me'}
              buttonAction={'http://example.com/some-link/'}
              // TODO: move into user menu div
              style={{
                zIndex: 11,
                position: 'absolute',
                right: 10,
                top: 50
              }}
            />
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
                    <Typography variant={'body2'}>
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
        { isGlobalCampaignLive
          ? (
            <FadeInDashboardAnimation>
              <CampaignBase
                showError={this.showError.bind(this)}
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
        <div
          style={{
            position: 'absolute',
            overflow: 'visible',
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'row-reverse',
            bottom: 10,
            right: 10
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'visible'
            }}
          >
            {
              this.state.numAdsToShow > 2
                ? <Ad
                  adId={SECOND_VERTICAL_AD_SLOT_DOM_ID}
                  style={{
                    display: 'flex',
                    minWidth: 300,
                    overflow: 'visible'
                  }}
                />
                : null
            }
            {
              this.state.numAdsToShow > 1
                ? <Ad
                  adId={VERTICAL_AD_SLOT_DOM_ID}
                  style={{
                    display: 'flex',
                    minWidth: 300,
                    overflow: 'visible',
                    marginTop: 10
                  }}
                />
                : null
            }
          </div>
          {
            this.state.numAdsToShow > 0
              ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'visible',
                    marginRight: 10
                  }}
                >
                  { (this.state.showAdExplanation && user)
                    ? (
                      <FadeInDashboardAnimation>
                        <div
                          data-test-id={'ad-explanation'}
                          style={{
                            display: 'inline-block',
                            float: 'right'
                          }}
                        >
                          <Paper>
                            <div
                              style={{
                                display: 'flex',
                                padding: '6px 14px',
                                marginBottom: 10,
                                alignItems: 'center',
                                background: dashboardIconInactiveColor
                              }}
                            >
                              <HeartIcon
                                color={primaryColor}
                                style={{
                                  width: 24,
                                  height: 24,
                                  marginRight: 14
                                }}
                              />
                              <Typography variant={'body2'}>
                                Did you know? The ads here are raising money for charity.
                              </Typography>
                              <Button
                                color={'primary'}
                                style={{
                                  marginLeft: 20,
                                  marginRight: 10
                                }}
                                onClick={() => {
                                  setUserDismissedAdExplanation()
                                  this.setState({
                                    showAdExplanation: false
                                  })
                                }}
                              >
                              Got it
                              </Button>
                            </div>
                          </Paper>
                        </div>
                      </FadeInDashboardAnimation>
                    )
                    : null
                  }
                  <Ad
                    adId={HORIZONTAL_AD_SLOT_DOM_ID}
                    style={{
                      overflow: 'visible',
                      minWidth: 728
                    }}
                  />
                </div>
              ) : null
          }
        </div>
        { user && tabId ? <LogTab user={user} tabId={tabId} /> : null }
        { user && tabId ? <LogRevenue user={user} tabId={tabId} /> : null }
        { user ? <LogConsentData user={user} /> : null }
        { user ? <LogAccountCreation user={user} /> : null }
        { user ? <AssignExperimentGroups user={user} isNewUser={false} /> : null }
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
