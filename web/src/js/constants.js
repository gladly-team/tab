
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

// The count of tabs opened in the most recent day the user was
// active. It could be today (ongoing) or a day in the past.
export const STORAGE_TABS_RECENT_DAY_COUNT = 'tab.user.lastTabDay.count'

// tab.clientLocation: general location info, stored client-side only
export const STORAGE_LOCATION_COUNTRY_ISO_CODE = 'tab.clientLocation.countryIsoCode'
export const STORAGE_LOCATION_IS_IN_EU = 'tab.clientLocation.isInEU'
export const STORAGE_LOCATION_QUERY_TIME = 'tab.clientLocation.queryTime'

// tab.referralData: referral data set on homepage
export const STORAGE_REFERRAL_DATA_REFERRING_USER = 'tab.referralData.referringUser'
export const STORAGE_REFERRAL_DATA_REFERRING_CHANNEL = 'tab.referralData.referringChannel'

// tab.consentData: values related to data privacy consent choices,
//   like GDPR
export const STORAGE_NEW_CONSENT_DATA_EXISTS = 'tab.consentData.newConsentDataExists'

// tab.newUser: values related to the new user experience, such as
//   data we need for unauthenticated users or temporary data we
//   don't want to store server-side. Stored client-side only.
export const STORAGE_NEW_USER_HAS_COMPLETED_TOUR = 'tab.newUser.hasCompletedTour'
export const STORAGE_EXTENSION_INSTALL_ID = 'tab.newUser.extensionInstallId'
export const STORAGE_APPROX_EXTENSION_INSTALL_TIME = 'tab.newUser.approxInstallTime'
export const STORAGE_DISMISSED_AD_EXPLANATION = 'tab.newUser.dismissedAdExplanation'

// tab.experiments: values related to split-testing features
// We may assign other values to localStorage with the tab.experiments.*
// prefix in experiments.js.
export const STORAGE_EXPERIMENT_PREFIX = 'tab.experiments'
export const STORAGE_EXPERIMENT_ANON_USER = 'tab.experiments.anonUser'
export const STORAGE_EXPERIMENT_VARIOUS_AD_SIZES = 'tab.experiments.variousAdSizes'

/**
  Error codes passed from server-side.
**/

export const ERROR_USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST'
