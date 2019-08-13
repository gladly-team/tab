/* eslint-disable jsx-a11y/href-no-hash */
import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import moment from 'moment'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import UserBackgroundImage from 'js/components/Dashboard/UserBackgroundImageContainer'
import UserMenu from 'js/components/Dashboard/UserMenuContainer'
import WidgetsContainer from 'js/components/Widget/WidgetsContainer'
import Ad from 'js/components/Ad/Ad'
import LogTab from 'js/components/Dashboard/LogTabContainer'
import LogRevenue from 'js/components/Dashboard/LogRevenueContainer'
import LogConsentData from 'js/components/Dashboard/LogConsentDataContainer'
import LogAccountCreation from 'js/components/Dashboard/LogAccountCreationContainer'
import AssignExperimentGroups from 'js/components/Dashboard/AssignExperimentGroupsContainer'
import HeartIcon from 'material-ui/svg-icons/action/favorite'
import { primaryColor, dashboardIconInactiveColor } from 'js/theme/default'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import ErrorMessage from 'js/components/General/ErrorMessage'
import Notification from 'js/components/Dashboard/NotificationComponent'
import { getCurrentUser } from 'js/authentication/user'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { detectSupportedBrowser } from 'js/utils/detectBrowser'
import {
  setUserDismissedAdExplanation,
  hasUserDismissedNotificationRecently,
  hasUserDismissedCampaignRecently,
} from 'js/utils/local-user-data-mgr'
import {
  CHROME_BROWSER,
  FIREFOX_BROWSER,
  STORAGE_NEW_USER_HAS_COMPLETED_TOUR,
} from 'js/constants'
import {
  goTo,
  inviteFriendsURL,
  loginURL,
  searchChromeExtensionPage,
  searchFirefoxExtensionPage,
} from 'js/navigation/navigation'
import {
  getNumberOfAdsToShow,
  shouldShowAdExplanation,
  VERTICAL_AD_SLOT_DOM_ID,
  SECOND_VERTICAL_AD_SLOT_DOM_ID,
  HORIZONTAL_AD_SLOT_DOM_ID,
} from 'js/ads/adSettings'
import { showGlobalNotification } from 'js/utils/feature-flags'
import {
  EXPERIMENT_REFERRAL_NOTIFICATION,
  EXPERIMENT_SEARCH_INTRO,
  getExperimentGroups,
  getUserExperimentGroup,
} from 'js/utils/experiments'
import LogUserExperimentActionsMutation from 'js/mutations/LogUserExperimentActionsMutation'

// Include ads code.
// TODO: load this on mount, making sure the ads code behaves
// appropriately for a SPA (it should not reload libraries but
// should re-fetch ads).
import 'js/ads/ads'

const NewUserTour = lazy(() =>
  import('js/components/Dashboard/NewUserTourContainer')
)
const CampaignBase = lazy(() =>
  import('js/components/Campaign/CampaignBaseView')
)

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errorMessage: null,
      errorOpen: false,
      tabId: uuid(),
      isUserAnonymous: false, // Set after mount if true
      // This may be false if the user cleared their storage,
      // which is why we only show the tour to recently-joined
      // users.
      userAlreadyViewedNewUserTour:
        localStorageMgr.getItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR) === 'true',
      numAdsToShow: getNumberOfAdsToShow(),
      showAdExplanation: shouldShowAdExplanation(),
      // Whether to show a global announcement.
      showNotification:
        showGlobalNotification() && !hasUserDismissedNotificationRecently(),
      // Determines what message (if any) we should show to introduce
      // Search for a Cause.
      searchIntroExperimentGroup: getUserExperimentGroup(
        EXPERIMENT_SEARCH_INTRO
      ),
      // @experiment-referral-notification
      referralNotificationExperimentGroup: getUserExperimentGroup(
        EXPERIMENT_REFERRAL_NOTIFICATION
      ),
      hasUserDismissedCampaignRecently: hasUserDismissedCampaignRecently(),
      // Let's assume a Chrome browser until we detect it.
      browser: CHROME_BROWSER,
    }
  }

  componentDidMount() {
    this.determineAnonymousStatus()
    this.setState({
      browser: detectSupportedBrowser(),
    })
  }

  /**
   * Check if the user is anonymous and update state with the
   * anonymous status.
   * @return {Promise<undefined>} A Promise that resolves after
   *   the state has been updated.
   */
  async determineAnonymousStatus() {
    const currentUser = await getCurrentUser()
    const isAnon = currentUser && currentUser.isAnonymous
    return new Promise((resolve, reject) => {
      this.setState(
        {
          isUserAnonymous: isAnon,
        },
        () => {
          resolve()
        }
      )
    })
  }

  showError(msg) {
    this.setState({
      errorOpen: true,
      errorMessage: msg,
    })
  }

  clearError() {
    this.setState({
      errorOpen: false,
    })
  }

  render() {
    // Props will be null on first render.
    const { user, app } = this.props
    const {
      browser,
      hasUserDismissedCampaignRecently,
      userAlreadyViewedNewUserTour,
      referralNotificationExperimentGroup,
      searchIntroExperimentGroup,
      tabId,
    } = this.state
    const { errorMessage, errorOpen } = this.state

    // Whether or not a campaign should show on the dashboard
    const showCampaign = !!(
      app &&
      app.isGlobalCampaignLive &&
      !hasUserDismissedCampaignRecently &&
      user.tabs > 1
    )

    // Show the tour if the user joined recently and localStorage
    // does not have a flag marking the tour as already viewed.
    const showNewUserTour =
      user &&
      moment()
        .utc()
        .diff(moment(user.joined), 'hours') < 2 &&
      !userAlreadyViewedNewUserTour

    // Determine if the user is in an experimental group for
    // the "referral notification" experiment.
    const referralExperiment = getExperimentGroups(
      EXPERIMENT_REFERRAL_NOTIFICATION
    )
    let isInReferralNotificationExperimentalGroup = false
    let referralNotificationTitle
    let referralNotificationBody
    switch (referralNotificationExperimentGroup) {
      case referralExperiment.NO_NOTIFICATION: {
        break
      }
      case referralExperiment.COPY_A: {
        isInReferralNotificationExperimentalGroup = true
        referralNotificationTitle = 'Together we can change the world!'
        referralNotificationBody =
          "Tab for a Cause is likely the easiest way to raise money for charity. Thanks to you, we are close to $1,000,000 raised. However, if each Tabber convinced just one friend to join, we'd raise MILLIONS together simply by browsing the web. Will you help us spread the word?"
        break
      }
      case referralExperiment.COPY_B: {
        isInReferralNotificationExperimentalGroup = true
        referralNotificationTitle = 'Earn more hearts!'
        referralNotificationBody =
          "Spread the word about Tab for a Cause and you'll earn 350 extra hearts for each friend that starts Tabbing!"
        break
      }
      case referralExperiment.COPY_C: {
        isInReferralNotificationExperimentalGroup = true
        referralNotificationTitle = 'Recruit your first friend'
        referralNotificationBody =
          "It looks like you haven't gotten any friends to join you on Tab for a Cause yet :( Could you let a few people know about it?"
        break
      }
      case referralExperiment.COPY_D: {
        isInReferralNotificationExperimentalGroup = true
        referralNotificationTitle = 'Help spread the word!'
        referralNotificationBody =
          "Sadly, most people don't know that Tab for a Cause exists. If you are enjoying raising money as you browse the web, could you increase your impact by telling a few friends about Tabbing?"
        break
      }
      case referralExperiment.COPY_E: {
        isInReferralNotificationExperimentalGroup = true
        referralNotificationTitle = 'Double your charitable impact!'
        referralNotificationBody =
          "Get a friend to join you on Tab for a Cause, and together we'll make the world an even better place."
        break
      }
      default:
        break
    }

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
          minWidth: 1080,
        }}
        data-test-id={'app-dashboard'}
        key={'dashboard-key'}
      >
        <UserBackgroundImage
          user={user}
          showError={this.showError.bind(this)}
        />
        {user && app ? (
          <FadeInDashboardAnimation>
            <div
              style={{
                position: 'fixed',
                zIndex: 10,
                top: 14,
                right: 10,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <UserMenu
                app={app}
                user={user}
                isUserAnonymous={this.state.isUserAnonymous}
              />
              {this.state.showNotification ? (
                <Notification
                  data-test-id={'global-notification'}
                  useGlobalDismissalTime
                  title={`Vote for the July Charity Spotlight`}
                  message={`
                        Each month this year, we're highlighting a charity chosen by our
                        community. Nominate and vote for the nonprofit that means the most to you.`}
                  buttonText={'Vote'}
                  buttonURL={'https://forms.gle/xcXfPmvsYXrwMnqs7'}
                  onDismiss={() => {
                    this.setState({
                      showNotification: false,
                    })
                  }}
                  style={{
                    marginTop: 4,
                  }}
                />
              ) : null}
              {// @experiment-referral-notification
              isInReferralNotificationExperimentalGroup &&
              !(
                user.experimentActions.referralNotification === 'CLICK' ||
                user.experimentActions.referralNotification === 'DISMISS'
              ) ? (
                <Notification
                  data-test-id={'experiment-referral-notification'}
                  title={referralNotificationTitle}
                  message={referralNotificationBody}
                  buttonText={'Tell a friend'}
                  onClick={async () => {
                    // Log the click.
                    await LogUserExperimentActionsMutation({
                      userId: user.id,
                      experimentActions: {
                        [EXPERIMENT_REFERRAL_NOTIFICATION]: 'CLICK',
                      },
                    })
                    this.setState({
                      referralNotificationExperimentGroup: false,
                    })

                    // Open the "invite friends" page.
                    goTo(inviteFriendsURL)
                  }}
                  onDismiss={async () => {
                    // Log the dismissal.
                    await LogUserExperimentActionsMutation({
                      userId: user.id,
                      experimentActions: {
                        [EXPERIMENT_REFERRAL_NOTIFICATION]: 'DISMISS',
                      },
                    })
                    this.setState({
                      referralNotificationExperimentGroup: false,
                    })
                  }}
                  style={{
                    width: 380,
                    marginTop: 4,
                  }}
                />
              ) : null}
              {// @experiment-search-intro
              (searchIntroExperimentGroup ===
                getExperimentGroups(EXPERIMENT_SEARCH_INTRO).INTRO_A ||
                searchIntroExperimentGroup ===
                  getExperimentGroups(EXPERIMENT_SEARCH_INTRO)
                    .INTRO_HOMEPAGE) &&
              !(
                user.experimentActions.searchIntro === 'CLICK' ||
                user.experimentActions.searchIntro === 'DISMISS'
              ) &&
              user.tabs > 3 ? (
                <Notification
                  data-test-id={'search-intro-notif'}
                  title={`We're working on Search for a Cause`}
                  message={
                    <span>
                      <Typography variant={'body2'} gutterBottom>
                        You already know Tab for a Cause, where{' '}
                        <b>tabs = money for charity</b>. Now, we want to have an
                        even bigger impact by making{' '}
                        <b>searches = money for charity</b>.
                      </Typography>
                      <Typography variant={'body2'} gutterBottom>
                        You're one of the first people we're introducing to
                        Search for a Cause. It's early, but we think it's a
                        great start, and we'd love your feedback. Will you test
                        it out?
                      </Typography>
                    </span>
                  }
                  buttonText={'Try it out'}
                  buttonURL={
                    searchIntroExperimentGroup ===
                    getExperimentGroups(EXPERIMENT_SEARCH_INTRO).INTRO_HOMEPAGE
                      ? 'https://search.gladly.io'
                      : browser === CHROME_BROWSER
                      ? searchChromeExtensionPage
                      : browser === FIREFOX_BROWSER
                      ? searchFirefoxExtensionPage
                      : searchChromeExtensionPage
                  }
                  onClick={async () => {
                    try {
                      // Log the click.
                      await LogUserExperimentActionsMutation({
                        userId: user.id,
                        experimentActions: {
                          [EXPERIMENT_SEARCH_INTRO]: 'CLICK',
                        },
                      })
                    } catch (e) {
                      console.error(e)
                    }

                    // Hide the message because we don't want the user to
                    // need to dismiss it after clicking the action, which
                    // would also confuse our test metrics.
                    this.setState({
                      searchIntroExperimentGroup: false,
                    })
                  }}
                  onDismiss={async () => {
                    try {
                      // Log the dismissal.
                      await LogUserExperimentActionsMutation({
                        userId: user.id,
                        experimentActions: {
                          [EXPERIMENT_SEARCH_INTRO]: 'DISMISS',
                        },
                      })
                    } catch (e) {
                      console.error(e)
                    }
                    this.setState({
                      searchIntroExperimentGroup: false,
                    })
                  }}
                  style={{
                    width: 440,
                    marginTop: 4,
                  }}
                />
              ) : null}
            </div>
          </FadeInDashboardAnimation>
        ) : null}
        {this.state.isUserAnonymous && user ? (
          <FadeInDashboardAnimation>
            <div
              data-test-id={'anon-sign-in-prompt-dashboard'}
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                top: 14,
              }}
            >
              <Paper>
                <div
                  style={{
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    background: dashboardIconInactiveColor,
                  }}
                >
                  <Typography variant={'body2'}>
                    Sign in to save your progress!
                  </Typography>
                  <Button
                    color={'primary'}
                    style={{
                      marginLeft: 10,
                      marginRight: 10,
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
        ) : null}
        <WidgetsContainer
          user={user}
          isCampaignLive={showCampaign}
          showError={this.showError.bind(this)}
        />
        {showCampaign ? (
          <FadeInDashboardAnimation>
            <Suspense fallback={null}>
              <CampaignBase
                onDismiss={() => {
                  this.setState({
                    hasUserDismissedCampaignRecently: true,
                  })
                }}
                showError={this.showError.bind(this)}
              />
            </Suspense>
          </FadeInDashboardAnimation>
        ) : null}
        {showNewUserTour ? (
          <Suspense fallback={null}>
            <NewUserTour user={user} />
          </Suspense>
        ) : null}
        <div
          style={{
            position: 'absolute',
            overflow: 'visible',
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'row-reverse',
            bottom: 10,
            right: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'visible',
            }}
          >
            {this.state.numAdsToShow > 2 ? (
              <Ad
                adId={SECOND_VERTICAL_AD_SLOT_DOM_ID}
                style={{
                  display: 'flex',
                  minWidth: 300,
                  overflow: 'visible',
                }}
              />
            ) : null}
            {this.state.numAdsToShow > 1 ? (
              <Ad
                adId={VERTICAL_AD_SLOT_DOM_ID}
                style={{
                  display: 'flex',
                  minWidth: 300,
                  overflow: 'visible',
                  marginTop: 10,
                }}
              />
            ) : null}
          </div>
          {this.state.numAdsToShow > 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                marginRight: 10,
              }}
            >
              {this.state.showAdExplanation && user ? (
                <FadeInDashboardAnimation>
                  <div
                    data-test-id={'ad-explanation'}
                    style={{
                      display: 'inline-block',
                      float: 'right',
                    }}
                  >
                    <Paper>
                      <div
                        style={{
                          display: 'flex',
                          padding: '6px 14px',
                          marginBottom: 10,
                          alignItems: 'center',
                          background: dashboardIconInactiveColor,
                        }}
                      >
                        <HeartIcon
                          color={primaryColor}
                          style={{
                            width: 24,
                            height: 24,
                            marginRight: 14,
                          }}
                        />
                        <Typography variant={'body2'}>
                          Did you know? The ads here are raising money for
                          charity.
                        </Typography>
                        <Button
                          color={'primary'}
                          style={{
                            marginLeft: 20,
                            marginRight: 10,
                          }}
                          onClick={() => {
                            setUserDismissedAdExplanation()
                            this.setState({
                              showAdExplanation: false,
                            })
                          }}
                        >
                          Got it
                        </Button>
                      </div>
                    </Paper>
                  </div>
                </FadeInDashboardAnimation>
              ) : null}
              <Ad
                adId={HORIZONTAL_AD_SLOT_DOM_ID}
                style={{
                  overflow: 'visible',
                  minWidth: 728,
                }}
              />
            </div>
          ) : null}
        </div>
        {user && tabId ? <LogTab user={user} tabId={tabId} /> : null}
        {user && tabId ? <LogRevenue user={user} tabId={tabId} /> : null}
        {user ? <LogConsentData user={user} /> : null}
        {user ? <LogAccountCreation user={user} /> : null}
        {user ? <AssignExperimentGroups user={user} isNewUser={false} /> : null}
        <ErrorMessage
          message={errorMessage}
          open={errorOpen}
          onClose={this.clearError.bind(this)}
        />
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    experimentActions: PropTypes.shape({
      referralNotification: PropTypes.string,
      searchIntro: PropTypes.string,
    }).isRequired,
    joined: PropTypes.string.isRequired,
    tabs: PropTypes.number.isRequired,
  }),
  app: PropTypes.shape({
    isGlobalCampaignLive: PropTypes.bool,
  }),
}

Dashboard.defaultProps = {
  app: {
    isGlobalCampaignLive: false,
  },
}

export default Dashboard
