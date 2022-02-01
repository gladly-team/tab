/* eslint-disable jsx-a11y/href-no-hash */
import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import uuid from 'uuid/v4'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import UserBackgroundImage from 'js/components/Dashboard/UserBackgroundImageContainer'
import UserMenu from 'js/components/Dashboard/UserMenuContainer'
import WidgetsContainer from 'js/components/Widget/WidgetsContainer'
import LogTab from 'js/components/Dashboard/LogTabContainer'
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
import Link from 'js/components/General/Link'
import {
  setUserDismissedAdExplanation,
  hasUserDismissedNotificationRecently,
  hasUserDismissedCampaignRecently,
  hasUserClickedNewTabSearchIntroNotif,
  setUserClickedNewTabSearchIntroNotif,
  hasUserClickedNewTabSearchIntroNotifV2,
  setUserClickedNewTabSearchIntroNotifV2,
  removeCampaignDismissTime,
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
  facebookPageURL,
  instagramPageURL,
  twitterPageURL,
} from 'js/navigation/navigation'
import { getHostname, getCurrentURL } from 'js/navigation/utils'
import {
  showGlobalNotification,
  showSearchIntroductionMessage,
  isGAMDevEnvironment,
} from 'js/utils/feature-flags'
import {
  EXPERIMENT_REFERRAL_NOTIFICATION,
  getExperimentGroups,
  getUserExperimentGroup,
} from 'js/utils/experiments'
import LogUserExperimentActionsMutation from 'js/mutations/LogUserExperimentActionsMutation'
import LogUserRevenueMutation from 'js/mutations/LogUserRevenueMutation'
import {
  areAdsEnabled,
  getAdUnits,
  shouldShowAdExplanation,
  showMockAds,
} from 'js/ads/adHelpers'
import { AdComponent, fetchAds } from 'tab-ads'
import logger from 'js/utils/logger'
import {
  STORAGE_YAHOO_SEARCH_DEMO_INFO_NOTIF,
  YAHOO_USER_ID,
} from 'js/constants'

const NewUserTour = lazy(() =>
  import('js/components/Dashboard/NewUserTourContainer')
)
const CampaignGeneric = lazy(() =>
  import('js/components/Campaign/CampaignGenericView')
)

// Load ads immediately when we parse this file rather than
// waiting for component mount. As a quick hack to make the
// existing tests work without resetting this module, also
// fetch ads component mount and provide a helper function
// to reset module state.
let calledLoadAds = false
export const __resetAds = () => {
  // This function is only a quick fix for tests.
  calledLoadAds = false
}
const loadAds = () => {
  if (calledLoadAds) {
    return
  }
  calledLoadAds = true
  const setGAMDevKey = isGAMDevEnvironment()
  try {
    // Debugging can be enabled with URL param tabAdsDebug=true.
    fetchAds({
      adUnits: Object.values(getAdUnits()),
      pageLevelKeyValues: { v4: 'false', ...(setGAMDevKey && { dev: 'true' }) },
      auctionTimeout: 1000,
      consent: {
        enabled: true,
        // Time to wait for the consent management platform (CMP) to respond.
        // If the CMP does not respond in this time, ad auctions may be cancelled.
        // The tab-cmp package aims to make the CMP respond much more quickly
        // than this after the user's first page load.
        timeout: 500,
      },
      publisher: {
        domain: getHostname(),
        pageUrl: getCurrentURL(),
      },
      logLevel: 'error',
      onError: e => {
        logger.error(e)
      },
      disableAds: !areAdsEnabled(),
      useMockAds: showMockAds(),
    })
  } catch (e) {
    logger.error(e)
  }
}
loadAds()

const styles = theme => ({
  paperArrow: {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      marginRight: 10,
      top: -8,
      right: 0,
      width: 10,
      height: 10,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
      transform: 'translate(-50%, 50%) rotate(-45deg)',
      clipPath:
        'polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))',
    },
  },
})

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
      showAdExplanation: shouldShowAdExplanation(),
      // Whether to show a global announcement.
      showNotification:
        showGlobalNotification() && !hasUserDismissedNotificationRecently(),
      adUnitsToShow: getAdUnits(),
      // Whether to show an introduction to Search for a Cause.
      showSearchIntroductionMessage: showSearchIntroductionMessage(),
      userClickedSearchIntroV1: hasUserClickedNewTabSearchIntroNotif(),
      userClickedSearchIntroV2: hasUserClickedNewTabSearchIntroNotifV2(),
      // @experiment-referral-notification
      referralNotificationExperimentGroup: getUserExperimentGroup(
        EXPERIMENT_REFERRAL_NOTIFICATION
      ),
      hasUserDismissedCampaignRecently: hasUserDismissedCampaignRecently(),
      // Let's assume a Chrome browser until we detect it.
      browser: CHROME_BROWSER,
      hasDismissedYahooDemoInfo:
        localStorageMgr.getItem(STORAGE_YAHOO_SEARCH_DEMO_INFO_NOTIF) ===
        'true',
    }
  }

  componentDidMount() {
    this.determineAnonymousStatus()
    this.setState({
      browser: detectSupportedBrowser(),
    })
    loadAds()
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
    const { user, app, classes } = this.props
    const {
      adUnitsToShow,
      browser,
      hasUserDismissedCampaignRecently,
      userAlreadyViewedNewUserTour,
      referralNotificationExperimentGroup,
      showSearchIntroductionMessage,
      tabId,
    } = this.state
    const {
      errorMessage,
      errorOpen,
      userClickedSearchIntroV1,
      // userClickedSearchIntroV2,
    } = this.state

    /*
     * A handler for AdComponents' onAdDisplayed callbacks, which receives
     * info about the displayed ad.
     * @param {Object|null} displayedAdInfo - A DisplayedAdInfo from tab-ads. See:
     *   https://github.com/gladly-team/tab-ads/blob/master/src/utils/DisplayedAdInfo.js
     * @param {Object} context - Additional info to help with revenue logging
     * @param {Object} context.user - The user object
     * @param {String} context.user.id - The user ID
     * @param {String} context.tabId - A UUID for this page load
     * @return {undefined}
     */
    const onAdDisplayed = (displayedAdInfo, context) => {
      // No ad was shown.
      if (!displayedAdInfo) {
        return
      }

      const {
        revenue,
        encodedRevenue,
        GAMAdvertiserId,
        GAMAdUnitId,
        adSize,
      } = displayedAdInfo

      // Log the revenue from the ad.
      LogUserRevenueMutation({
        userId: context.user.id,
        revenue,
        ...(encodedRevenue && {
          encodedRevenue: {
            encodingType: 'AMAZON_CPM',
            encodedValue: encodedRevenue,
          },
        }),
        dfpAdvertiserId: GAMAdvertiserId.toString(),
        adSize,
        // Only send aggregationOperation value if we have more than one
        // revenue value
        aggregationOperation:
          !isNil(revenue) && !isNil(encodedRevenue) ? 'MAX' : null,
        tabId: context.tabId,
        adUnitCode: GAMAdUnitId,
        isV4: false,
      })
    }

    // Logs any errors the occur in the ad components
    const onAdError = e => {
      logger.error(e)
    }

    // Whether or not a campaign should show on the dashboard
    const isCampaignLive = !!(app && app.campaign && app.campaign.isLive)
    const showCampaign = !!(
      isCampaignLive &&
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

    // Whether to show a search introduction message or button.
    // Show the search introduction message to all users who:
    // * haven't already searched
    // * haven't already clicked the intro message
    // * haven't already interacted with the intro in our previous experiment
    // * have opened at least three tabs
    // * have joined in the past 6 weeks
    const showSearchIntro =
      showSearchIntroductionMessage &&
      user &&
      user.searches < 1 &&
      !userClickedSearchIntroV1 &&
      !(
        user.experimentActions.searchIntro === 'CLICK' ||
        user.experimentActions.searchIntro === 'DISMISS'
      ) &&
      user.tabs > 3 &&
      moment()
        .utc()
        .diff(moment(user.joined), 'weeks') < 6

    // Show the sparkly search introduction button to all users who:
    // * haven't already searched
    // * aren't seeing the search intro message
    // * haven't already clicked the intro button
    // * have opened at least 150 tabs
    // const showSparklySearchIntroButton =
    //   showSearchIntroductionMessage &&
    //   user &&
    //   user.searches < 1 &&
    //   !showSearchIntro &&
    //   !userClickedSearchIntroV2 &&
    //   user.tabs > 150
    const showSparklySearchIntroButton = false

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

    const adContext = {
      user,
      tabId,
    }
    const adContextReady = get(adContext, 'user.id') && get(adContext, 'tabId')

    const isYahooUser = user && user.id === YAHOO_USER_ID

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
                browser={browser}
                user={user}
                isUserAnonymous={this.state.isUserAnonymous}
                showSparklySearchIntroButton={showSparklySearchIntroButton}
                onClickSparklySearchIntroButton={() => {
                  setUserClickedNewTabSearchIntroNotifV2()
                  this.setState({
                    userClickedSearchIntroV2: true,
                  })
                }}
                showCampaignReopenButton={
                  isCampaignLive && hasUserDismissedCampaignRecently
                }
                onClickCampaignReopen={() => {
                  this.setState({
                    hasUserDismissedCampaignRecently: false,
                  })
                  removeCampaignDismissTime()
                }}
              />
              {isYahooUser && !this.state.hasDismissedYahooDemoInfo ? (
                <Paper className={classes.paperArrow}>
                  <div
                    data-test-id="yahoo-demo-info"
                    style={{
                      maxWidth: 300,
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant={'body1'}>
                      You can view your stats, our terms, and our privacy policy
                      here.
                    </Typography>
                    <Button
                      color={'primary'}
                      onClick={() => {
                        localStorageMgr.setItem(
                          STORAGE_YAHOO_SEARCH_DEMO_INFO_NOTIF,
                          'true'
                        )
                        this.setState({ hasDismissedYahooDemoInfo: true })
                      }}
                      style={{ marginLeft: 'auto' }}
                    >
                      Got it
                    </Button>
                  </div>
                </Paper>
              ) : null}
              {this.state.showNotification ? (
                <Notification
                  data-test-id={'global-notification'}
                  useGlobalDismissalTime
                  title={`Vote for the January Charity Spotlight`}
                  message={
                    <>
                      <Typography variant={'body2'} gutterBottom>
                        Let us know what nonprofit we should spotlight this
                        month!
                      </Typography>

                      <Typography variant={'body2'}>
                        Have a suggestion for an organization you'd like to see
                        in the future?{' '}
                        <Link
                          to={'https://forms.gle/Do6qW37VPDL5Wavg9'}
                          target="_blank"
                          style={{ color: '#9d4ba3' }}
                        >
                          Tell us here.
                        </Link>
                      </Typography>
                    </>
                  }
                  buttonText={'Vote'}
                  buttonURL={'https://forms.gle/F8Uqg2NFWASjn7Nx5'}
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
              {showSearchIntro ? (
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
                    browser === CHROME_BROWSER
                      ? searchChromeExtensionPage
                      : browser === FIREFOX_BROWSER
                      ? searchFirefoxExtensionPage
                      : searchChromeExtensionPage
                  }
                  onClick={() => {
                    // Hide the message because we don't want the user to
                    // need to dismiss it after clicking.
                    this.setState({
                      userClickedSearchIntroV1: true,
                    })
                    setUserClickedNewTabSearchIntroNotif()
                  }}
                  onDismiss={() => {
                    this.setState({
                      userClickedSearchIntroV1: true,
                    })
                    setUserClickedNewTabSearchIntroNotif()
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
        {showCampaign && app && user ? (
          <FadeInDashboardAnimation>
            <Suspense fallback={null}>
              <CampaignGeneric
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
            {adUnitsToShow.rectangleAdSecondary && adContextReady ? (
              <AdComponent
                adId={adUnitsToShow.rectangleAdSecondary.adId}
                onAdDisplayed={displayedAdInfo => {
                  onAdDisplayed(displayedAdInfo, adContext)
                }}
                onError={onAdError}
                style={{
                  display: 'flex',
                  minWidth: 300,
                  overflow: 'visible',
                }}
              />
            ) : null}
            {adUnitsToShow.rectangleAdPrimary && adContextReady ? (
              <AdComponent
                adId={adUnitsToShow.rectangleAdPrimary.adId}
                onAdDisplayed={displayedAdInfo => {
                  onAdDisplayed(displayedAdInfo, adContext)
                }}
                onError={onAdError}
                style={{
                  display: 'flex',
                  minWidth: 300,
                  overflow: 'visible',
                  marginTop: 10,
                }}
              />
            ) : null}
          </div>
          {adUnitsToShow.leaderboard && adContextReady ? (
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
              <AdComponent
                adId={adUnitsToShow.leaderboard.adId}
                onAdDisplayed={displayedAdInfo => {
                  onAdDisplayed(displayedAdInfo, adContext)
                }}
                onError={onAdError}
                style={{
                  overflow: 'visible',
                  minWidth: 728,
                }}
              />
            </div>
          ) : null}
        </div>
        {user && tabId ? <LogTab user={user} tabId={tabId} /> : null}
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
    searches: PropTypes.number.isRequired,
    tabs: PropTypes.number.isRequired,
  }),
  app: PropTypes.shape({
    campaign: PropTypes.shape({
      isLive: PropTypes.bool.isRequired,
    }).isRequired,
  }),
}

Dashboard.defaultProps = {}

export default withStyles(styles, { withTheme: true })(Dashboard)
