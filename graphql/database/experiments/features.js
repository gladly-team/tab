import {
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
} from './experimentConstants'

const features = {
  'money-raised-exclamation-point': {
    defaultValue: false,
    rules: [
      /* Begin internal overrides */
      {
        condition: {
          v4BetaEnabled: true,
          'internalExperimentOverrides.money-raised-exclamation-point': true,
        },
        // Using variations instead of "force" also ensures other experiment
        // logic, such as logging the experiment assignment, is working
        // correctly.
        variations: [true, false],
        weights: [1.0, 0.0],
      },
      {
        condition: {
          v4BetaEnabled: true,
          'internalExperimentOverrides.money-raised-exclamation-point': false,
        },
        variations: [true, false],
        weights: [0.0, 1.0],
      },
      /* End internal overrides */
      {
        variations: [false, true],
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
