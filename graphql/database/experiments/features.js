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
  'user-survey-2022-notification': {
    defaultValue: false,
    rules: [
      {
        // Show locally.
        condition: {
          env: 'local',
        },
        force: true,
      },
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
        // TODO: set to true when ready
        force: false,
      },
    ],
  },
}

features[YAHOO_SEARCH_EXISTING_USERS] = {
  defaultValue: false,
  // Enable when SFAC search engine is enabled.
  // rules: [
  //   {
  //     condition: {
  //       isTabTeamMember: true,
  //       env: 'local',
  //     },
  //     force: true,
  //   },
  // ],
}

features[YAHOO_SEARCH_NEW_USERS] = {
  defaultValue: 'Google',
  // Enable when SFAC search engine is enabled.
  // rules: [
  //   {
  //     condition: {
  //       isTabTeamMember: true,
  //       env: 'local',
  //     },
  //     force: 'SearchForACause',
  //   },
  // ],
}

export default features
