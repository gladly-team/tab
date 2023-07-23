import {
  MONEY_RAISED_EXCLAMATION_POINT_V2,
  NOTIF_ONE_AND_HALF_MILLION,
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
  YAHOO_SEARCH_NEW_USERS_V2,
  SUPPORTING_CAUSE_CHIP,
  SFAC_EXISTING_USER_ACTIVITY_ICON,
  SFAC_EXTENSION_PROMPT,
  SEARCH_EXPERIMENT_EXISTING_USERS_CUTOFF_UNIX_TIME,
  SEARCH_EXPERIMENT_NEW_USERS_CUTOFF_UNIX_TIME,
  SEARCH_EXPERIMENT_NEW_USERS_V2_CUTOFF_UNIX_TIME,
  SFAC_EXTENSION_PROMPT_CUTOFF_UNIX_TIME,
  SEARCHBAR_SFAC_EXTENSION_PROMPT,
  GLOBAL_HEALTH_GROUP_IMPACT,
  ENDING_HUNGER_GROUP_IMPACT,
  REDUCED_IMPACT_COST,
  USER_SURVEY_MARCH_2023,
  V4_SUPPORTING_STATEMENTS,
  LAUNCH_BOOKMARKS,
  GROUP_IMPACT_LEADERBOARD,
  SHFAC_NOTIFY_FULLPAGE_AUG,
} from './experimentConstants'

const features = {
  [MONEY_RAISED_EXCLAMATION_POINT_V2]: {
    defaultValue: false,
    rules: [
      /* Begin internal overrides */
      {
        condition: {
          v4BetaEnabled: true,
          [`internalExperimentOverrides.${MONEY_RAISED_EXCLAMATION_POINT_V2}`]:
            {
              $eq: true,
              $exists: true,
            },
        },
        force: true,
      },
      {
        condition: {
          v4BetaEnabled: true,
          [`internalExperimentOverrides.${MONEY_RAISED_EXCLAMATION_POINT_V2}`]:
            {
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
  [SFAC_EXISTING_USER_ACTIVITY_ICON]: {
    defaultValue: 'Control',
    rules: [
      /* Begin internal overrides */
      {
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          [`internalExperimentOverrides.${SFAC_EXISTING_USER_ACTIVITY_ICON}`]: {
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
          [`internalExperimentOverrides.${SFAC_EXISTING_USER_ACTIVITY_ICON}`]: {
            $eq: 'Icon',
            $exists: true,
          },
        },
        force: 'Icon',
      },
      /* End internal overrides */
      {
        variations: ['Control', 'Icon'],
        // Experiment ended Sept 20, 2022. We want want to enable the "Icon"
        // treatment group for all *existing* users but leave new users in
        // the control group here so the SFAC experience for new users is
        // dictated by the ongoing "sfac-extension-prompt" experiment.
        // weights: [0.5, 0.5],
        // coverage: 0.5,
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          joined: {
            // Users who joined after this in the experiment for new users.
            $lte: SFAC_EXTENSION_PROMPT_CUTOFF_UNIX_TIME,
          },
        },
        force: 'Icon',
      },
    ],
  },
  // TODO: move filter logic into app code and clean up.
  // Ended experiment on Oct 6, 2022.
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
        // variations: ['Control', 'Notification'],
        // weights: [0.5, 0.5],
        // coverage: 1.0,
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
        force: 'Notification',
      },
    ],
  },
  // TODO: remove anytime after mid-August 2022.
  [SUPPORTING_CAUSE_CHIP]: {
    defaultValue: true,
  },
  [NOTIF_ONE_AND_HALF_MILLION]: {
    defaultValue: false,
    rules: [
      // Show on local/dev for our team only.
      {
        condition: {
          isTabTeamMember: true,
          env: 'local',
        },
        force: false,
      },
      {
        condition: {
          isTabTeamMember: true,
          env: 'dev',
        },
        force: false,
      },
      {
        condition: {
          tabs: {
            $gte: 10,
          },
        },
        force: false,
      },
    ],
  },
  [SEARCHBAR_SFAC_EXTENSION_PROMPT]: {
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
          [`internalExperimentOverrides.${SEARCHBAR_SFAC_EXTENSION_PROMPT}`]: {
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
          [`internalExperimentOverrides.${SEARCHBAR_SFAC_EXTENSION_PROMPT}`]: {
            $eq: 'Notification',
            $exists: true,
          },
        },
        force: 'Notification',
      },
      /* End internal overrides */
      {
        variations: ['Control', 'Notification'],
        weights: [0.1, 0.9],
        coverage: 1.0,
        condition: {
          v4BetaEnabled: {
            $eq: true,
          },
          tabs: {
            $gt: 3,
          },
        },
      },
    ],
  },
  // Whether to enable group impact on the Global Health cause.
  [GLOBAL_HEALTH_GROUP_IMPACT]: {
    defaultValue: false,
    rules: [
      // Local/dev only.
      {
        condition: {
          env: {
            $in: ['local', 'dev', 'production'],
          },
        },
        force: true,
      },
    ],
  },
  // Whether to enable group impact on the Ending Hunger cause.
  [ENDING_HUNGER_GROUP_IMPACT]: {
    defaultValue: false,
    rules: [
      // Local/dev only.
      {
        condition: {
          env: {
            $in: ['local', 'dev', 'production'],
          },
        },
        force: true,
      },
    ],
  },
  // Whether to reduce the impact cost -- only for internal testing.
  [REDUCED_IMPACT_COST]: {
    defaultValue: false,
    rules: [
      // Local/dev only.
      {
        condition: {
          env: {
            $in: ['local', 'dev'],
          },
        },
        force: true,
      },
    ],
  },
  [USER_SURVEY_MARCH_2023]: {
    defaultValue: false,
    rules: [
      {
        condition: {
          tabs: {
            $gt: 20,
          },
        },
        force: true,
      },
    ],
  },
  [V4_SUPPORTING_STATEMENTS]: {
    defaultValue: 'Control',
    rules: [
      /* Begin internal overrides */
      {
        condition: {
          env: {
            $in: ['local', 'dev'],
          },
          [`internalExperimentOverrides.${V4_SUPPORTING_STATEMENTS}`]: {
            $eq: 'Control',
            $exists: true,
          },
        },
        force: 'Control',
      },
      {
        condition: {
          env: {
            $in: ['local', 'dev'],
          },
          [`internalExperimentOverrides.${V4_SUPPORTING_STATEMENTS}`]: {
            $eq: 'Experiment',
            $exists: true,
          },
        },
        force: 'Experiment',
      },
      /* End internal overrides */
      {
        variations: ['Control', 'Experiment'],
        weights: [0.5, 0.5],
        coverage: 1.0,
        condition: {},
      },
    ],
  },

  [SHFAC_NOTIFY_FULLPAGE_AUG]: {
    defaultValue: 'Version1',
    rules: [
      {
        variations: ['Version1', 'Version2', 'Version3'],
        weights: [1.0],
        coverage: 1.0,
        condition: {
          tabs: {
            $gt: 20,
          },
        },
      },
    ],
  },

  [LAUNCH_BOOKMARKS]: {
    defaultValue: false,
    rules: [
      {
        condition: {
          env: {
            $in: ['local', 'dev'],
          },
        },
        force: true,
      },
    ],
  },

  [GROUP_IMPACT_LEADERBOARD]: {
    defaultValue: true,
  },
}

export default features
