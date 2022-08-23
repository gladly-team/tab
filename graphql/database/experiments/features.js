import {
  MONEY_RAISED_EXCLAMATION_POINT_V2,
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
  YAHOO_SEARCH_NEW_USERS_V2,
  SUPPORTING_CAUSE_CHIP,
  SFAC_EXTENSION_PROMPT,
  COLLEGE_AMBASSADOR_2022_NOTIF,
} from './experimentConstants'

// Consider a user "existing" if they join before this time.
const SEARCH_EXPERIMENT_EXISTING_USERS_CUTOFF_UNIX_TIME = 1651154400000 // 2pm UTC 28 April 2022

// Consider a user "new" if they join after this time. This should be
// later in the future than when the experiment goes live, because
// the experiment includes behavior during signup.
const SEARCH_EXPERIMENT_NEW_USERS_CUTOFF_UNIX_TIME = 1651165200000 // 5pm UTC 28 April 2022

// Consider a user "new" for V2 if they join after this time. This should be
// later in the future than when the experiment goes live, because
// the experiment includes behavior during signup.
const SEARCH_EXPERIMENT_NEW_USERS_V2_CUTOFF_UNIX_TIME = 1655843400000 // 20:30pm UTC 21 June 2022

const SFAC_EXTENSION_PROMPT_CUTOFF_UNIX_TIME = 1660719600000 // 20:30pm UTC 21 June 2022

const features = {
  [MONEY_RAISED_EXCLAMATION_POINT_V2]: {
    defaultValue: false,
    rules: [
      /* Begin internal overrides */
      {
        condition: {
          v4BetaEnabled: true,
          [`internalExperimentOverrides.${MONEY_RAISED_EXCLAMATION_POINT_V2}`]: {
            $eq: true,
            $exists: true,
          },
        },
        force: true,
      },
      {
        condition: {
          v4BetaEnabled: true,
          [`internalExperimentOverrides.${MONEY_RAISED_EXCLAMATION_POINT_V2}`]: {
            $eq: false,
            $exists: true,
          },
        },
        force: false,
      },
      /* End internal overrides */
      {
        variations: [false, true],
        weights: [0.5, 0.5],
        coverage: 0.4,
        condition: {
          v4BetaEnabled: true,
        },
      },
    ],
  },
  [YAHOO_SEARCH_EXISTING_USERS]: {
    defaultValue: false,
    rules: [
      /* Begin internal overrides */
      {
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          [`internalExperimentOverrides.${YAHOO_SEARCH_EXISTING_USERS}`]: {
            $eq: true,
            $exists: true,
          },
        },
        force: true,
      },
      {
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          [`internalExperimentOverrides.${YAHOO_SEARCH_EXISTING_USERS}`]: {
            $eq: false,
            $exists: true,
          },
        },
        force: false,
      },
      /* End internal overrides */
      {
        variations: [false, true],
        weights: [0.5, 0.5],
        coverage: 1.0,
        condition: {
          joined: {
            $lt: SEARCH_EXPERIMENT_EXISTING_USERS_CUTOFF_UNIX_TIME,
          },
          v4BetaEnabled: {
            $eq: true,
          },
        },
      },
    ],
  },
  // TODO: remove and clean up references
  [YAHOO_SEARCH_NEW_USERS]: {
    defaultValue: 'Google',
    rules: [
      // Internal Overrides may not be useful here because we are assigning search engine on user creation.
      /* End internal overrides */
      {
        variations: ['Google', 'SearchForACause'],
        weights: [0.5, 0.5],
        coverage: 0.0,
        condition: {
          joined: {
            $gt: SEARCH_EXPERIMENT_NEW_USERS_CUTOFF_UNIX_TIME,
          },
          v4BetaEnabled: {
            $eq: true,
          },
        },
      },
    ],
  },
  [YAHOO_SEARCH_NEW_USERS_V2]: {
    defaultValue: 'Tooltip',
    rules: [
      /* Begin internal overrides */
      {
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          [`internalExperimentOverrides.${YAHOO_SEARCH_NEW_USERS_V2}`]: {
            $eq: 'Control',
            $exists: true,
          },
        },
        force: 'Control',
      },
      {
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          [`internalExperimentOverrides.${YAHOO_SEARCH_NEW_USERS_V2}`]: {
            $eq: 'Tooltip',
            $exists: true,
          },
        },
        force: 'Tooltip',
      },
      {
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          [`internalExperimentOverrides.${YAHOO_SEARCH_NEW_USERS_V2}`]: {
            $eq: 'Notification',
            $exists: true,
          },
        },
        force: 'Notification',
      },
      /* End internal overrides */
      {
        variations: ['Control', 'Tooltip', 'Notification'],
        weights: [0.34, 0.33, 0.33],
        coverage: 0.0,
        condition: {
          joined: {
            $gt: SEARCH_EXPERIMENT_NEW_USERS_V2_CUTOFF_UNIX_TIME,
          },
          v4BetaEnabled: {
            $eq: true,
          },
        },
      },
    ],
  },
  [SFAC_EXTENSION_PROMPT]: {
    defaultValue: 'Control',
    rules: [
      /* Begin internal overrides */
      {
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          tabs: {
            $gt: 3,
          },
          [`internalExperimentOverrides.${SFAC_EXTENSION_PROMPT}`]: {
            $eq: 'Control',
            $exists: true,
          },
        },
        force: 'Control',
      },
      {
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          tabs: {
            $gt: 3,
          },
          [`internalExperimentOverrides.${SFAC_EXTENSION_PROMPT}`]: {
            $eq: 'Notification',
            $exists: true,
          },
        },
        force: 'Notification',
      },
      /* End internal overrides */
      {
        variations: ['Control', 'Notification'],
        weights: [0.5, 0.5],
        coverage: 0.0,
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          tabs: {
            $gt: 3,
          },
          joined: {
            $gt: SFAC_EXTENSION_PROMPT_CUTOFF_UNIX_TIME,
          },
        },
      },
    ],
  },
  // TODO: remove anytime after mid-August 2022.
  [SUPPORTING_CAUSE_CHIP]: {
    defaultValue: true,
  },
  [COLLEGE_AMBASSADOR_2022_NOTIF]: {
    defaultValue: false,
    rules: [
      // Show on local/dev for our team only.
      {
        condition: {
          isTabTeamMember: true,
          env: 'local',
        },
        force: true,
      },
      {
        condition: {
          isTabTeamMember: true,
          env: 'dev',
        },
        force: true,
      },
      // TODO: enable
      // @feature/ambassador-notification
      // {
      //   condition: {
      //     tabs: {
      //       $gte: 50,
      //     },
      //   },
      //   force: true,
      // },
    ],
  },
}

export default features
