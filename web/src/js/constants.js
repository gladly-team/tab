/**
  Configuration
**/

export const MAX_DAILY_HEARTS_FROM_TABS = 150

/**
  Strings passed from server-side. Do not change.
**/

export const WIDGET_TYPE_BOOKMARKS = 'bookmarks'
export const WIDGET_TYPE_CLOCK = 'clock'
export const WIDGET_TYPE_NOTES = 'notes'
export const WIDGET_TYPE_SEARCH = 'search'
export const WIDGET_TYPE_TODOS = 'todos'

export const USER_BACKGROUND_OPTION_CUSTOM = 'custom'
export const USER_BACKGROUND_OPTION_COLOR = 'color'
export const USER_BACKGROUND_OPTION_PHOTO = 'photo'
export const USER_BACKGROUND_OPTION_DAILY = 'daily'

/**
  localStorage keys. Do not change, or it may
  break storage for existing users.
**/

// tab.user: user attributes persisted server-side
export const STORAGE_KEY_USERNAME = 'tab.user.username'
export const STORAGE_BACKGROUND_COLOR = 'tab.user.background.color'
export const STORAGE_BACKGROUND_CUSTOM_IMAGE = 'tab.user.background.customImage'
export const STORAGE_BACKGROUND_IMAGE_URL = 'tab.user.background.imageURL'
export const STORAGE_BACKGROUND_OPTION = 'tab.user.background.option'

// An ISO timestamp: the time of the first tab opened in the
// most recent day (UTC day) the user was active.
export const STORAGE_TABS_LAST_TAB_OPENED_DATE = 'tab.user.lastTabDay.date'
export const STORAGE_NOTIFICATIONS_DISMISS_TIME =
  'tab.user.notifications.dismissTime'
export const STORAGE_CAMPAIGN_DISMISS_TIME = 'tab.user.campaign.dismissTime'

// The count of tabs opened in the most recent day the user was
// active. It could be today (ongoing) or a day in the past.
export const STORAGE_TABS_RECENT_DAY_COUNT = 'tab.user.lastTabDay.count'

// tab.clientLocation: general location info, stored client-side only
export const STORAGE_LOCATION_COUNTRY_ISO_CODE =
  'tab.clientLocation.countryIsoCode'
export const STORAGE_LOCATION_IS_IN_EU = 'tab.clientLocation.isInEU'
export const STORAGE_LOCATION_QUERY_TIME = 'tab.clientLocation.queryTime'

// tab.referralData: referral data set on homepage
export const STORAGE_REFERRAL_DATA_REFERRING_USER =
  'tab.referralData.referringUser'
export const STORAGE_REFERRAL_DATA_REFERRING_CHANNEL =
  'tab.referralData.referringChannel'

// tab.consentData: values related to data privacy consent choices,
//   like GDPR
export const STORAGE_NEW_CONSENT_DATA_EXISTS =
  'tab.consentData.newConsentDataExists'

// tab.newUser: values related to the new user experience, such as
//   data we need for unauthenticated users or temporary data we
//   don't want to store server-side. Stored client-side only.
export const STORAGE_NEW_USER_HAS_COMPLETED_TOUR =
  'tab.newUser.hasCompletedTour'
export const STORAGE_EXTENSION_INSTALL_ID = 'tab.newUser.extensionInstallId'
export const STORAGE_APPROX_EXTENSION_INSTALL_TIME =
  'tab.newUser.approxInstallTime'
export const STORAGE_DISMISSED_AD_EXPLANATION =
  'tab.newUser.dismissedAdExplanation'
export const STORAGE_CLICKED_NEW_TAB_SEARCH_INTRO =
  'tab.newUser.clickedNewTabSearchIntro'
export const STORAGE_CLICKED_NEW_TAB_SEARCH_INTRO_V2 =
  'tab.newUser.clickedNewTabSearchIntroV2'
export const STORAGE_NEW_USER_IS_TAB_V4_BETA = 'tab.newUser.isTabV4Enabled'
export const STORAGE_NEW_USER_CAUSE_ID = 'tab.newUser.causeId'
export const STORAGE_CATS_CAUSE_ID = 'CA6A5C2uj'
export const STORAGE_SEAS_CAUSE_ID = 'SGa6zohkY'
export const STORAGE_TREES_CAUSE_ID = 'tdU_PsRIM'
export const STORAGE_BLACK_EQUITY_CAUSE_ID = 'q1FFsAhbV'
export const STORAGE_GLOBAL_HEALTH_CAUSE_ID = 'sPFpWRT7q'
export const STORAGE_ENDING_HUNGER_CAUSE_ID = '1HCq9sFTp'
export const STORAGE_UKRAINE_CAUSE_ID = 'JmClR7bmy'
export const STORAGE_REPRODUCTIVE_HEALTH_CAUSE_ID = '4mC9rt2rb'
export const STORAGE_LGBTQ_CAUSE_ID = 'qoP35Uli6'
export const STORAGE_REFERRAL_DATA_MISSION_ID = 'tab.referralData.missionId'
// tab.experiments: values related to split-testing features
// We may assign other values to localStorage with the tab.experiments.*
// prefix in experiments.js.
export const STORAGE_EXPERIMENT_PREFIX = 'tab.experiments'
export const STORAGE_EXPERIMENT_ANON_USER = 'tab.experiments.anonUser'
export const STORAGE_EXPERIMENT_VARIOUS_AD_SIZES =
  'tab.experiments.variousAdSizes'

// search.newUser: values related to the Search for a Cause new user
//   experience, such as data we need for unauthenticated users or
//   temporary data we don't want to store server-side. Stored client-side
//   only.
export const SEARCH_STORAGE_NEW_USER_HAS_DISMISSED_INTRO =
  'search.newUser.dismissedIntro'

// search.user: values related to the Search for a Cause user.
export const SEARCH_STORAGE_USER_BING_CLIENT_ID = 'search.user.bingClientID'

// search.referralData: referral data set on homepage
export const SEARCH_STORAGE_REFERRAL_DATA_REFERRING_USER =
  'search.referralData.referringUser'
export const SEARCH_STORAGE_REFERRAL_DATA_REFERRING_CHANNEL =
  'search.referralData.referringChannel'

// Storage redirect keys
export const STORAGE_REDIRECT_URI = 'auth.redirect.uri'

/**
  Error codes passed from server-side.
**/

export const ERROR_USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST'

/**
  Code constants.
**/
export const TAB_APP = 'tab'
export const SHOP_APP = 'shop'
export const SEARCH_APP = 'search'

export const CHROME_BROWSER = 'chrome'
export const FIREFOX_BROWSER = 'firefox'
export const EDGE_BROWSER = 'edge'
export const SAFARI_BROWSER = 'safari'
export const OPERA_BROWSER = 'opera'
export const UNSUPPORTED_BROWSER = 'other'

export const SEARCH_PROVIDER_BING = 'bing'
export const SEARCH_PROVIDER_CODEFUEL = 'codefuel'
export const SEARCH_PROVIDER_YAHOO = 'yahoo'

export const SEARCH_SRC_CHROME_EXTENSION = 'chrome'
export const SEARCH_SRC_FIREFOX_EXTENSION = 'ff'
export const SEARCH_SRC_TAB_FOR_A_CAUSE = 'tab'
export const SEARCH_SRC_OWN_PAGE = 'self'

export const SEARCH_INTRO_QUERY_ENGLISH =
  'How many searches do people make every day?'

export const STORAGE_YAHOO_SEARCH_DEMO = 'tab.yahoo.searchdemo'
export const STORAGE_YAHOO_SEARCH_DEMO_INFO_NOTIF = 'tab.yahoo.searchdemoInfo'

export const STORAGE_LOGGED_OUT_TABS = 'tab.user.loggedOutTabsCount'
export const LOGGED_OUT_MESSAGE_TYPE = {
  NONE: 'none',
  OLD: 'old',
  NEW: 'new',
}

// local testing -- default user

// export const YAHOO_USER_ID = 'VXNlcjphYmNkZWZnaGlqa2xtbm8='

// prod

export const YAHOO_USER_ID = 'VXNlcjpFaDFTMGd0RXZZU1daalo4QjBrazRqazZ6Qm0y'

// iFrameBased Widget URLs
export const WIDGET_MOTHERS_DAY_2023_URL =
  'http://localhost:8002/promos/mothers-day-2023?nolayout=true'
