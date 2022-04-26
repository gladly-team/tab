import {
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
} from './experimentConstants'

const features = {
  'money-raised-exclamation-point-v2': {
    defaultValue: false,
    rules: [
      /* Begin internal overrides */
      {
        condition: {
          v4BetaEnabled: true,
          'internalExperimentOverrides.money-raised-exclamation-point-v2': {
            $eq: true,
            $exists: true,
          },
        },
        force: true,
      },
      {
        condition: {
          v4BetaEnabled: true,
          'internalExperimentOverrides.money-raised-exclamation-point-v2': {
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
}

features[YAHOO_SEARCH_EXISTING_USERS] = {
  defaultValue: false,
  rules: [
    /* Begin internal overrides */
    {
      condition: {
        v4BetaEnabled: {
          $eq: true,
        },
        'internalExperimentOverrides.search-existing-users': {
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
        'internalExperimentOverrides.search-existing-users': {
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
        joined: {
          $lt: 1650726528502, // make a later date when we go to production.
        },
        v4BetaEnabled: {
          $eq: true,
        },
      },
    },
  ],
}

features[YAHOO_SEARCH_NEW_USERS] = {
  defaultValue: 'Google',
  rules: [
    // Internal Overrides may not be useful here because we are assigning search engine on user creation.
    /* End internal overrides */
    {
      variations: ['Google', 'SearchForACause'],
      weights: [0.5, 0.5],
      coverage: 1.0,
      condition: {
        joined: {
          $gt: 1650726528502, // make a later date when we go to production.
        },
        v4BetaEnabled: {
          $eq: true,
        },
      },
    },
  ],
}

export default features
