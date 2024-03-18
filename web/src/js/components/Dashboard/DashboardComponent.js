/* eslint-disable jsx-a11y/href-no-hash */
import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
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
import { dashboardIconInactiveColor } from 'js/theme/default'
import FadeInDashboardAnimation from 'js/components/General/FadeInDashboardAnimation'
import ErrorMessage from 'js/components/General/ErrorMessage'
import Notification from 'js/components/Dashboard/NotificationComponent'
import { getCurrentUser } from 'js/authentication/user'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { detectSupportedBrowser } from 'js/utils/detectBrowser'
import {
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
} from 'js/navigation/navigation'
import {
  showGlobalNotification,
  showSearchIntroductionMessage,
} from 'js/utils/feature-flags'
import {
  EXPERIMENT_REFERRAL_NOTIFICATION,
  getExperimentGroups,
  getUserExperimentGroup,
} from 'js/utils/experiments'
import LogUserExperimentActionsMutation from 'js/mutations/LogUserExperimentActionsMutation'
import {
  STORAGE_YAHOO_SEARCH_DEMO_INFO_NOTIF,
  YAHOO_USER_ID,
} from 'js/constants'
import SfacExtensionSellNotification from 'js/components/Dashboard/SfacExtensionSellNotification'
//import ShfacExtensionSellNotification from 'js/components/Dashboard/ShfacExtensionSellNotification'
import Link from 'js/components/General/Link'
import switchToV4 from 'js/utils/switchToV4'
//import WidgetIFrame from 'js/components/Widget/WidgetIFrame'

const NewUserTour = lazy(() =>
  import('js/components/Dashboard/NewUserTourContainer')
)
const CampaignGeneric = lazy(() =>
  import('js/components/Campaign/CampaignGenericView')
)

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

const batchKey = 'november-2023-shop-batch'
// const baseUrl = 'https://wild.link/e?d=20397233'
const NOV_NO_SHOP_DISMISS = 'tab.user.dismissedNotif.november-2023-no-shop'
//const GIVE_DIRECTLY_DISMISS = 'tab.user.dismissedNotif.give-directly-10-2023'

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
      // Whether to show a global announcement.
      showNotification:
        showGlobalNotification() && !hasUserDismissedNotificationRecently(),
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
      notificationsToShow: [],
      showIFrameWidget: false,
      dismissNovShop: localStorageMgr.getItem(NOV_NO_SHOP_DISMISS) === 'true',
      batch: 1,
      // dismissGiveDirectly:
      //   localStorageMgr.getItem(GIVE_DIRECTLY_DISMISS) === 'true',
    }
  }

  // Function to update the state
  updateState() {
    const now = new Date().getTime()
    const storedData = localStorageMgr.getItem(batchKey)

    if (storedData) {
      const { timestamp, currentState } = JSON.parse(storedData)

      // Calculate the number of 3-min intervals passed since the timestamp
      const intervalsPassed = Math.floor((now - timestamp) / (3 * 60 * 1000))

      if (intervalsPassed > 0) {
        // Calculate the new state based on intervals passed
        const newState = ((currentState + intervalsPassed - 1) % 4) + 1
        const newTimestamp = timestamp + intervalsPassed * 3 * 60 * 1000

        // Update local storage and state
        localStorageMgr.setItem(
          batchKey,
          JSON.stringify({ timestamp: newTimestamp, currentState: newState })
        )
        this.setState({ batch: newState })
      } else {
        // If less than 3 min have passed, keep the current state
        this.setState({ batch: currentState })
      }
    } else {
      // If no data in local storage, set default state and store it
      const defaultData = { timestamp: now, currentState: 1 }
      localStorageMgr.setItem(batchKey, JSON.stringify(defaultData))
      this.setState({ batch: 1 })
    }
  }

  componentDidMount() {
    this.determineAnonymousStatus()
    this.setState({
      browser: detectSupportedBrowser(),
    })
    this.updateState()
  }

  componentWillReceiveProps(nextProps) {
    this.setNotificationsToShow(nextProps)
  }

  onNovShopClick = () => {
    window.open('https://shop.gladly.io/', '_blank')
  }

  onDismissNovShop() {
    localStorageMgr.setItem(NOV_NO_SHOP_DISMISS, true)
    this.setState({ dismissNovShop: true })
  }

  async onGiveDirectlyClick() {
    const { user, relay } = this.props

    await switchToV4({
      relayEnvironment: relay.environment,
      userId: user.id,
      causeId: 'p7HGxRbQZ',
    })
  }

  onCloseiFrameWidget = () => {
    this.setState({ showIFrameWidget: false })
  }

  setNotificationsToShow(props) {
    const { user = {} } = props || this.props
    const { notifications = [] } = user

    // Determine if we should show any notifications. Currently, each
    // notification is is configured on a one-off basis here (UI) and in the
    // backend (enabling/disabling).
    const setNotifsToShow = notifs => {
      this.setState({ notificationsToShow: notifs })
    }
    const NOTIF_DISMISS_PREFIX = 'tab.user.dismissedNotif'
    const getNotifDismissKey = code => `${NOTIF_DISMISS_PREFIX}.${code}`
    const onNotificationClose = code => {
      localStorageMgr.setItem(getNotifDismissKey(code), 'true')
      setNotifsToShow(notifsToShow.filter(notif => notif.code !== code))
    }
    const hasDismissedNotif = notif =>
      localStorageMgr.getItem(getNotifDismissKey(notif.code)) === 'true'

    // Filter out notifications that have been dismissed and add a
    // helper for dismissing.
    const notifsToShow = notifications
      .filter(n => !hasDismissedNotif(n))
      .map(n => ({
        ...n,
        onDismiss: () => onNotificationClose(n.code),
      }))

    this.setState({ notificationsToShow: notifsToShow })
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

  // onDismissGiveDirectly() {
  //   localStorageMgr.setItem(GIVE_DIRECTLY_DISMISS, true)
  //   this.setState({ dismissGiveDirectly: true })
  // }

  render() {
    const { user, app, classes } = this.props
    const {
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

    // // See if we have a shop name for our charity
    // var shopCharityName = 'Charity'

    // if (user && user.cause && 'nameForShop' in user.cause) {
    //   shopCharityName = user.cause.nameForShop
    // }

    // /*
    //  * A handler for AdComponents' onAdDisplayed callbacks, which receives
    //  * info about the displayed ad.
    //  * @param {Object|null} displayedAdInfo - A DisplayedAdInfo from tab-ads. See:
    //  *   https://github.com/gladly-team/tab-ads/blob/master/src/utils/DisplayedAdInfo.js
    //  * @param {Object} context - Additional info to help with revenue logging
    //  * @param {Object} context.user - The user object
    //  * @param {String} context.user.id - The user ID
    //  * @param {String} context.tabId - A UUID for this page load
    //  * @return {undefined}
    //  */
    // const onAdDisplayed = (displayedAdInfo, context) => {
    //   // No ad was shown.
    //   if (!displayedAdInfo) {
    //     return
    //   }

    //   const {
    //     revenue,
    //     encodedRevenue,
    //     GAMAdvertiserId,
    //     GAMAdUnitId,
    //     adSize,
    //   } = displayedAdInfo

    //   // Log the revenue from the ad.
    //   LogUserRevenueMutation({
    //     userId: context.user.id,
    //     revenue,
    //     ...(encodedRevenue && {
    //       encodedRevenue: {
    //         encodingType: 'AMAZON_CPM',
    //         encodedValue: encodedRevenue,
    //       },
    //     }),
    //     dfpAdvertiserId: GAMAdvertiserId.toString(),
    //     adSize,
    //     // Only send aggregationOperation value if we have more than one
    //     // revenue value
    //     aggregationOperation:
    //       !isNil(revenue) && !isNil(encodedRevenue) ? 'MAX' : null,
    //     tabId: context.tabId,
    //     adUnitCode: GAMAdUnitId,
    //     isV4: false,
    //   })
    // }

    // // Logs any errors the occur in the ad components
    // const onAdError = e => {
    //   logger.error(e)
    // }

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

    const isYahooUser = user && user.id === YAHOO_USER_ID

    // const notificationsToShow = this.state.notificationsToShow

    // // Our Notification
    // const notif = notificationsToShow.find(
    //   notif => notif.code === 'user-survey-december-2023'
    // )

    // // Our Notification - Shop
    // let notif = notificationsToShow.find(
    //   notif => notif.code === 'shfac-notify-fullpage-nov'
    // )

    // if (
    //   notif &&
    //   notif.variation !== 'Version1' &&
    //   notif.variation !== 'Version2' &&
    //   notif.variation !== 'Version3'
    // ) {
    //   notif = null
    // }

    // // Our Notification - Search
    // let notifSearch = notificationsToShow.find(
    //   notif => notif.code === 'sfac-notify-fullpage-nov'
    // )

    // if (
    //   notifSearch &&
    //   notifSearch.variation !== 'Version1' &&
    //   notifSearch.variation !== 'Version2' &&
    //   notifSearch.variation !== 'Version3'
    // ) {
    //   notifSearch = null
    // }

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

        {/* Nov 2023 Shop promo - shop 
        {user && !this.state.dismissNovShop ? (
          <Paper
            align="center"
            style={{
              width: 650,
              position: 'relative',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 25,
              padding: 20,
              zIndex: '1000',
            }}
          >
            <IconButton
              onClick={this.onDismissNovShop.bind(this)}
              style={{ position: 'absolute', right: 5, top: 0 }}
            >
              <CloseIcon sx={{ color: '#fff', width: 28, height: 28 }} />
            </IconButton>
            <Typography variant={'h4'} gutterBottom>
              Give back during your Holiday Shopping
            </Typography>

            
            
            !user.shopSignupTimestamp && (
              <Typography variant="body1" gutterBottom>
                Raise money for {shopCharityName} when you shop these Black
                Friday deals! Just click the links below before to shop through
                our partner stores and they’ll give up to 5% back for your
                cause. Or, you can download{' '}
                <a
                  href="http://shop.gladly.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop for a Cause
                </a>{' '}
                which will automatically help you raise money from over 10,000
                stores.
              </Typography>
            )}

            {user.shopSignupTimestamp && (
              <Typography variant={'body1'} gutterBottom>
                Raise money for {user.cause.nameForShop || 'Charity'} when you
                shop these Black Friday deals–you can earn up to 10% back! As a
                bonus for activating an offer, you’ll be entered into a drawing
                for one of two $100 Visa gift cards (
                <a
                  href="https://gladly.zendesk.com/hc/en-us/articles/21341815958541-Black-Friday-2023-100-Gift-Card-Giveaway-Details"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  promo details
                </a>
                ).
              </Typography>
            )}

            {this.state.batch === 1 && (
              <div style={imageGroupStyles}>
                <a
                  href={`${baseUrl}&c=5482116&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.lego.com/')}`}
                  className={promoStyles.hoverable}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={LegoLogo} width="100" alt="" />
                </a>
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=5483936&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.walmart.com/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={WalmartLogo} width="100" alt="" />
                </a>
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=5481985&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.sephora.com/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={SephoraLogo} width="100" alt="" />
                </a>
              </div>
            )}

            {this.state.batch === 2 && (
              <div style={imageGroupStyles}>
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=5475597&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.backcountry.com/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={horseLogo} width="100" alt="" />
                </a>
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=144406&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.thriftbooks.com/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={ThriftBooksLogo} width="100" alt="" />
                </a>
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=5475228&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.aliexpress.us/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={allExpressLogo} width="100" alt="" />
                </a>
              </div>
            )}
            {this.state.batch === 3 && (
              <div style={imageGroupStyles}>
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=5479361&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.kiwico.com/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={KiwicoLogo} width="100" alt="" />
                </a>
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=5481855&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.samsung.com/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={SamsungLogo} width="100" alt="" />
                </a>{' '}
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=5482453&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.sonos.com/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={SonosLogo} width="100" alt="" />
                </a>{' '}
              </div>
            )}
            {this.state.batch === 4 && (
              <div style={imageGroupStyles}>
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=5478249&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.glossier.com/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={glossierLogo} width="100" alt="" />
                </a>
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=145193&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://bookshop.org/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={bookshopLogo} width="100" alt="" />
                </a>{' '}
                <a
                  className={promoStyles.hoverable}
                  href={`${baseUrl}&c=5479801&tc=${
                    user.userId
                  }&url=${encodeURIComponent('https://www.lowes.com/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={lowesLogo} width="100" alt="" />
                </a>{' '}
              </div>
            )}
          </Paper>
                ) : null */}

        {/* Give Directly Promo
        {user && !this.state.dismissGiveDirectly ? (
          <Paper
            align="center"
            style={{
              width: 675,
              position: 'relative',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 50,
              padding: 20,
              zIndex: '100',
            }}
          >
            <IconButton
              onClick={this.onDismissGiveDirectly.bind(this)}
              style={{ position: 'absolute', right: 5, top: 0 }}
            >
              <CloseIcon sx={{ color: '#fff', width: 28, height: 28 }} />
            </IconButton>

            <Typography variant={'h4'} gutterBottom>
              Help Eradicate Extreme Poverty
            </Typography>
            <Typography variant={'body1'} gutterBottom>
              Nearly 700 million people live in extreme poverty (earning less
              than $2.15 per day). We’ve partnered with{' '}
              <a
                href="https://www.givedirectly.org/?utm_source=tabforcause"
                target="_blank"
                rel="noopener noreferrer"
              >
                GiveDirectly
              </a>{' '}
              to create Tab for Ending Poverty to address this large but
              solvable problem. Money raised will support GiveDirectly’s
              unconditional cash transfers which{' '}
              <a
                href="https://www.givedirectly.org/research-at-give-directly/?utm_source=tabforacause"
                target="_blank"
                rel="noopener noreferrer"
              >
                research has shown
              </a>{' '}
              improve the health, income, education, and self-reliance of
              recipients.
            </Typography>

            <Typography variant={'body1'} gutterBottom>
              Read more on our{' '}
              <a
                href="https://www.instagram.com/tabforacause/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>{' '}
              and join our effort to eliminate extreme poverty!
            </Typography>

            <Button
              onClick={this.onGiveDirectlyClick.bind(this)}
              variant="contained"
              color="primary"
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              Join Tab for Ending Poverty
            </Button>
          </Paper>
        ) : null} */}

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
                alignItems: 'flex-end',
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

              {/*** Notification ***/}
              {/* {notif ? (
                <Notification
                  useGlobalDismissalTime
                  title={`Time for the 2023 Tabber Survey!`}
                  message={
                    <>
                      <Typography variant={'body2'} gutterBottom>
                        Help decide what is next for Tab for a Cause by
                        providing your feedback. Thanks for Tabbing!
                      </Typography>
                    </>
                  }
                  buttonText={'Take Survey'}
                  buttonURL={
                    'https://docs.google.com/forms/d/e/1FAIpQLScnsvTq8s3oSOzD9jaCCYcsa-LbNPQyIZDU9lSVSJWIMPeNWg/viewform'
                  }
                  onDismiss={notif.onDismiss}
                  style={{
                    marginTop: 4,
                  }}
                />
              ) : null} */}

              {/* {notif ? (
                <ShfacExtensionSellNotification
                  userId={user.id}
                  variation={notif.variation}
                />
              ) : null} */}

              {/*** Deprecated: Notification enabled by hardcoded feature flag ***/}
              {this.state.showNotification ? (
                <Notification
                  data-test-id={'global-notification'}
                  useGlobalDismissalTime
                  title={`We're well on our way`}
                  message={
                    <>
                      <Typography variant={'body2'} gutterBottom>
                        We’re 20% of the way to{' '}
                        <Link
                          to={'https://campaigns.gladly.io'}
                          target="_blank"
                          style={{ color: '#9d4ba3' }}
                        >
                          restoring a well in Malawi
                        </Link>
                        ! Try Search for a Cause to help us reach our goal by
                        the end of the month.
                      </Typography>
                    </>
                  }
                  buttonText={'Make a search'}
                  buttonURL={'https://tab.gladly.io/get-search/'}
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

              {/*** Charity spotlight voting ***
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
                  // <Link
                  //   to={'https://www.instagram.com/tabforacause/'}
                  //   target="_blank"
                  //   style={{ color: '#9d4ba3' }}
                  // >
                  //   Instagram
                  // </Link>
                  // ,{' '}
                  // <Link
                  //   to={'https://www.tiktok.com/@tabforacause'}
                  //   target="_blank"
                  //   style={{ color: '#9d4ba3' }}
                  // >
                  //   TikTok
                  // </Link>
                  // , or{' '}
                  // <Link
                  //   to={'https://twitter.com/TabForACause'}
                  //   target="_blank"
                  //   style={{ color: '#9d4ba3' }}
                  // >
                  //   Twitter
                  // </Link>{' '}
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
              */}
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

              <SfacExtensionSellNotification
                userId={user.id}
                showSfacExtensionPrompt={user.showSfacExtensionPrompt}
              />
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
            <div
              id="raptive-content-ad-1"
              style={{
                display: 'flex',
                minWidth: 300,
                overflow: 'visible',
              }}
            />

            <div
              id="raptive-content-ad-2"
              style={{
                display: 'flex',
                minWidth: 300,
                overflow: 'visible',
                marginTop: 10,
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'visible',
              marginRight: 10,
            }}
          >
            <div
              id="raptive-content-ad-3"
              style={{
                overflow: 'visible',
                minWidth: 728,
              }}
            />
          </div>
        </div>

        {user && tabId ? <LogTab user={user} tabId={tabId} /> : null}
        {user ? <LogAccountCreation user={user} /> : null}
        {user ? <AssignExperimentGroups user={user} isNewUser={false} /> : null}
        <ErrorMessage
          message={errorMessage}
          open={errorOpen}
          onClose={this.clearError.bind(this)}
        />
        {/* {user && this.state.showIFrameWidget && notif ? (
          <FadeInDashboardAnimation>
            <WidgetIFrame
              widgetName={'shfac-notify-fullpage-nov'}
              onClose={() => {
                this.onCloseiFrameWidget()
              }}
              url={
                WIDGET_FULLPAGE_SHOP_URL +
                '?cause_name=' +
                (user.cause && user.cause.nameForShop
                  ? user.cause.nameForShop
                  : 'Charity') +
                '&user_id=' +
                user.userId +
                '&version=' +
                notif.variation
              }
            />
          </FadeInDashboardAnimation>
        ) : null} */}

        {/* {user && this.state.showIFrameWidget && notifSearch ? (
          <FadeInDashboardAnimation>
            <WidgetIFrame
              widgetName={'sfac-notify-fullpage-nov'}
              onClose={() => {
                this.onCloseiFrameWidget()
              }}
              url={
                WIDGET_FULLPAGE_SEARCH_URL +
                '?cause_name=' +
                (user.cause && user.cause.nameForShop
                  ? user.cause.nameForShop
                  : 'Charity') +
                '&user_id=' +
                user.userId +
                '&version=' +
                notifSearch.variation
              }
            />
          </FadeInDashboardAnimation>
        ) : null} */}
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
    notifications: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string.isRequired,
        variation: PropTypes.string,
      })
    ),
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

Dashboard.defaultProps = {
  notifications: [],
}

export default withStyles(styles, { withTheme: true })(Dashboard)
