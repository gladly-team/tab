export default new GraphQLInputObjectType({
  name: 'ExperimentGroups',
  description: 'The experimental groups to which the user is assigned',
  fields: {
    anonSignIn: {
      type: new GraphQLEnumType({
        name: 'ExperimentGroupAnonSignIn',
        description: 'The test of allowing anonymous user authentication',
        values: {
          NONE: { value: experimentConfig.anonSignIn.NONE },
          AUTHED_USER_ONLY: {
            value: experimentConfig.anonSignIn.AUTHED_USER_ONLY,
          },
          ANONYMOUS_ALLOWED: {
            value: experimentConfig.anonSignIn.ANONYMOUS_ALLOWED,
          },
        },
      }),
    },
    variousAdSizes: {
      type: new GraphQLEnumType({
        name: 'ExperimentGroupVariousAdSizes',
        description: 'The test of enabling many different ad sizes',
        values: {
          NONE: { value: experimentConfig.variousAdSizes.NONE },
          STANDARD: { value: experimentConfig.variousAdSizes.STANDARD },
          VARIOUS: { value: experimentConfig.variousAdSizes.VARIOUS },
        },
      }),
    },
    thirdAd: {
      type: new GraphQLEnumType({
        name: 'ExperimentGroupThirdAd',
        description: 'The test of enabling a third ad',
        values: {
          NONE: { value: experimentConfig.thirdAd.NONE },
          TWO_ADS: { value: experimentConfig.thirdAd.TWO_ADS },
          THREE_ADS: { value: experimentConfig.thirdAd.THREE_ADS },
        },
      }),
    },
    oneAdForNewUsers: {
      type: new GraphQLEnumType({
        name: 'ExperimentGroupOneAdForNewUsers',
        description: 'The test of showing only one ad to new users',
        values: {
          NONE: { value: experimentConfig.oneAdForNewUsers.NONE },
          DEFAULT: { value: experimentConfig.oneAdForNewUsers.DEFAULT },
          ONE_AD_AT_FIRST: {
            value: experimentConfig.oneAdForNewUsers.ONE_AD_AT_FIRST,
          },
        },
      }),
    },
    adExplanation: {
      type: new GraphQLEnumType({
        name: 'ExperimentGroupAdExplanation',
        description: 'The test of showing an explanation of why there are ads',
        values: {
          NONE: { value: experimentConfig.adExplanation.NONE },
          DEFAULT: { value: experimentConfig.adExplanation.DEFAULT },
          SHOW_EXPLANATION: {
            value: experimentConfig.adExplanation.SHOW_EXPLANATION,
          },
        },
      }),
    },
    searchIntro: {
      type: new GraphQLEnumType({
        name: 'ExperimentGroupSearchIntro',
        description:
          'The test of showing an introduction message to Search for a Cause',
        values: {
          NONE: { value: experimentConfig.searchIntro.NONE },
          NO_INTRO: { value: experimentConfig.searchIntro.NO_INTRO },
          INTRO_A: {
            value: experimentConfig.searchIntro.INTRO_A,
          },
          INTRO_HOMEPAGE: {
            value: experimentConfig.searchIntro.INTRO_HOMEPAGE,
          },
        },
      }),
    },
    referralNotification: {
      type: new GraphQLEnumType({
        name: 'ExperimentGroupReferralNotification',
        description:
          'The test of showing a notification to ask users to recruit friends',
        values: {
          NONE: { value: experimentConfig.referralNotification.NONE },
          NO_NOTIFICATION: {
            value: experimentConfig.referralNotification.NO_NOTIFICATION,
          },
          COPY_A: {
            value: experimentConfig.referralNotification.COPY_A,
          },
          COPY_B: {
            value: experimentConfig.referralNotification.COPY_B,
          },
          COPY_C: {
            value: experimentConfig.referralNotification.COPY_C,
          },
          COPY_D: {
            value: experimentConfig.referralNotification.COPY_D,
          },
          COPY_E: {
            value: experimentConfig.referralNotification.COPY_E,
          },
        },
      }),
    },
  },
});