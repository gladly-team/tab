export const MONEY_RAISED_EXCLAMATION_POINT_V2 =
  'money-raised-exclamation-point-v2'
export const SFAC_EXISTING_USER_ACTIVITY_ICON =
  'sfac-existing-user-activity-icon'
export const SFAC_EXTENSION_PROMPT = 'sfac-extension-prompt'
export const SUPPORTING_CAUSE_CHIP = 'supporting-cause-chip'
export const YAHOO_SEARCH_NEW_USERS = 'yahoo-search-new-users'
export const YAHOO_SEARCH_NEW_USERS_V2 = 'yahoo-search-new-users-v2'
export const YAHOO_SEARCH_EXISTING_USERS = 'yahoo-search-existing-users'
export const SEARCHBAR_SFAC_EXTENSION_PROMPT = 'searchbar-sfac-extension-prompt'
export const GLOBAL_HEALTH_GROUP_IMPACT = 'global-health-group-impact'
export const ENDING_HUNGER_GROUP_IMPACT = 'ending-hunger-group-impact'
export const REDUCED_IMPACT_COST = 'reduced-impact-cost'
export const USER_SURVEY_MARCH_2023 = 'user-survey-march-2023'

// One-off notifications
export const COLLEGE_AMBASSADOR_2022_NOTIF = 'college-ambassador-2022-notif'
export const NOTIF_ONE_AND_HALF_MILLION = 'one-and-half-mil-raised-notif'

// Consider a user "existing" if they join before this time.
export const SEARCH_EXPERIMENT_EXISTING_USERS_CUTOFF_UNIX_TIME = 1651154400000 // 2pm UTC 28 April 2022

// Consider a user "new" if they join after this time. This should be
// later in the future than when the experiment goes live, because
// the experiment includes behavior during signup.
export const SEARCH_EXPERIMENT_NEW_USERS_CUTOFF_UNIX_TIME = 1651165200000 // 5pm UTC 28 April 2022

// Consider a user "new" for V2 if they join after this time. This should be
// later in the future than when the experiment goes live, because
// the experiment includes behavior during signup.
export const SEARCH_EXPERIMENT_NEW_USERS_V2_CUTOFF_UNIX_TIME = 1655843400000 // 20:30pm UTC 21 June 2022

// Cutoff time for search extension experiment. Users are considered
// new if they join after this time.
export const SFAC_EXTENSION_PROMPT_CUTOFF_UNIX_TIME = 1662494400000 // 20:00 UTC 6 September 2022

// Test out stronger "supporting" statements : TFAC-1023
export const V4_SUPPORTING_STATEMENTS = 'v4-supporting-statements'

// Notify users that SHFAC has launched
export const SHFAC_NOTIFY_FULLPAGE_SEPT = 'shfac-notify-fullpage-sept'

// Notify users that SHFAC has launched
export const SFAC_NOTIFY_FULLPAGE_AUG = 'sfac-notify-fullpage-aug'

// Bookmarks Feature Flag
export const LAUNCH_BOOKMARKS = 'launch-bookmarks'

// Feature Flag to show Group Impact Leaderboard
export const GROUP_IMPACT_LEADERBOARD = 'group-impact-leaderboard'
