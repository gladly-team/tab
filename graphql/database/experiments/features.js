import {
  MONEY_RAISED_EXCLAMATION_POINT_V2,
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
} from './experimentConstants'

// Consider a user "existing" if they join before this time.
const SEARCH_EXPERIMENT_EXISTING_USERS_CUTOFF_UNIX_TIME = 1651096800000 // 10pm UTC 27 April 2022

// TODO: update before launch
// Consider a user "new" if they join after this time. This should be
// later in the future than when the experiment goes live, because
// the experiment includes behavior during signup.
const SEARCH_EXPERIMENT_NEW_USERS_CUTOFF_UNIX_TIME = 1651100400000 // 11pm UTC 27 April 2022

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
  'user-survey-2022-notification': {
    defaultValue: false,
    rules: [
      {
        // Show on dev for our team only.
        condition: {
          isTabTeamMember: true,
          env: 'dev',
        },
        force: true,
      },
      {
        condition: {
          tabs: {
            $gte: 10,
          },
        },
        force: true,
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
        coverage: 0.3,
        condition: {
          // TODO: open to all environments to launch
          env: {
            $in: ['local', 'dev'],
          },
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
  [YAHOO_SEARCH_NEW_USERS]: {
    defaultValue: 'Google',
    rules: [
      // Internal Overrides may not be useful here because we are assigning search engine on user creation.
      /* End internal overrides */
      {
        variations: ['Google', 'SearchForACause'],
        weights: [0.5, 0.5],
        coverage: 1.0,
        condition: {
          // TODO: open to all environments to launch
          env: {
            $in: ['local', 'dev'],
          },
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
}

export default features
