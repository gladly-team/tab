/* eslint no-use-before-define: 0 */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  connectionFromPromisedArray,
} from 'graphql-relay'
import {
  WIDGET,
  CHARITY,
  USER,
  BACKGROUND_IMAGE,
  USER_RECRUITS,
} from '../database/constants'

import { experimentConfig } from '../utils/experiments'

import Widget from '../database/widgets/Widget'
import getWidget from '../database/widgets/getWidget'
import getWidgets from '../database/widgets/getWidgets'
import getAllBaseWidgets from '../database/widgets/baseWidget/getAllBaseWidgets'
import {
  updateWidgetData,
  updateWidgetVisibility,
  updateWidgetEnabled,
  updateWidgetConfig,
} from '../database/widgets/updateWidget'

import UserModel from '../database/users/UserModel'
import createUser from '../database/users/createUser'
import setUsername from '../database/users/setUsername'
import logEmailVerified from '../database/users/logEmailVerified'
import logTab from '../database/users/logTab'
import logSearch from '../database/users/logSearch'
import checkSearchRateLimit from '../database/users/checkSearchRateLimit'
import logRevenue from '../database/userRevenue/logRevenue'
import logUserDataConsent from '../database/userDataConsent/logUserDataConsent'
import mergeIntoExistingUser from '../database/users/mergeIntoExistingUser'
import setActiveWidget from '../database/users/setActiveWidget'
import setBackgroundImage from '../database/users/setBackgroundImage'
import setBackgroundImageFromCustomURL from '../database/users/setBackgroundImageFromCustomURL'
import setBackgroundColor from '../database/users/setBackgroundColor'
import setBackgroundImageDaily from '../database/users/setBackgroundImageDaily'
import logUserExperimentGroups from '../database/users/logUserExperimentGroups'
import logUserExperimentActions from '../database/users/logUserExperimentActions'
import constructExperimentActionsType from '../database/users/constructExperimentActionsType'
import logReferralLinkClick from '../database/referrals/logReferralLinkClick'

import CharityModel from '../database/charities/CharityModel'
import getCharities from '../database/charities/getCharities'

import donateVc from '../database/donations/donateVc'
import getCharityVcReceived from '../database/donations/getCharityVcReceived'

import BackgroundImageModel from '../database/backgroundImages/BackgroundImageModel'

// eslint-disable-next-line import/no-named-as-default
import getRecruits, {
  getTotalRecruitsCount,
  getRecruitsActiveForAtLeastOneDay,
} from '../database/referrals/getRecruits'

import {
  getMoneyRaised,
  getReferralVcReward,
  getDollarsPerDayRate,
  isGlobalCampaignLive,
} from '../database/globals/globals'
import getCampaign from '../database/globals/getCampaign'

class App {
  constructor(id) {
    this.id = id
  }

  static getApp(id) {
    return new App(id)
  }
}

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
// https://stackoverflow.com/a/33411416
// Note that it's NOT required for a type to use the Node interface:
// https://github.com/facebook/relay/issues/1061#issuecomment-227857031
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'App') {
      return App.getApp(id)
    }
    if (type === USER) {
      return UserModel.get(context.user, id)
    }
    if (type === WIDGET) {
      return getWidget(context.user, id)
    }
    if (type === CHARITY) {
      return CharityModel.get(context.user, id)
    }
    if (type === BACKGROUND_IMAGE) {
      return BackgroundImageModel.get(context.user, id)
    }
    return null
  },
  obj => {
    if (obj instanceof App) {
      // eslint-disable-next-line no-use-before-define
      return appType
    }
    if (obj instanceof UserModel) {
      // eslint-disable-next-line no-use-before-define
      return userType
    }
    if (obj instanceof Widget) {
      // eslint-disable-next-line no-use-before-define
      return widgetType
    }
    if (obj instanceof CharityModel) {
      // eslint-disable-next-line no-use-before-define
      return charityType
    }
    if (obj instanceof BackgroundImageModel) {
      // eslint-disable-next-line no-use-before-define
      return backgroundImageType
    }
    return null
  }
)

/**
 * Define your own types here
 */

const backgroundImageType = new GraphQLObjectType({
  name: BACKGROUND_IMAGE,
  description: 'A background image',
  fields: () => ({
    id: globalIdField(BACKGROUND_IMAGE),
    name: {
      type: GraphQLString,
      description: 'the background image name',
    },
    image: {
      type: GraphQLString,
      description: 'The image filename',
    },
    imageURL: {
      type: GraphQLString,
      description: 'The image file URL',
    },
    thumbnail: {
      type: GraphQLString,
      description: 'The image thumbnail filename',
    },
    thumbnailURL: {
      type: GraphQLString,
      description: 'The image thumbnail URL',
    },
    timestamp: {
      type: GraphQLString,
      description:
        'ISO datetime string of when the background image was last set',
    },
  }),
  interfaces: [nodeInterface],
})

const maxTabsDayType = new GraphQLObjectType({
  name: 'MaxTabsDay',
  description: "Info about the user's day of most opened tabs",
  fields: () => ({
    date: {
      type: GraphQLString,
      description: 'The day the most tabs were opened',
    },
    numTabs: {
      type: GraphQLInt,
      description: 'The number of tabs opened on that day',
    },
  }),
})

const maxSearchesDayType = new GraphQLObjectType({
  name: 'MaxSearchesDay',
  description: "Info about the user's day of most searches",
  fields: () => ({
    date: {
      type: GraphQLString,
      description: 'The day (datetime)the most searches occurred',
    },
    numSearches: {
      type: GraphQLInt,
      description: 'The number of searches made on that day',
    },
  }),
})

const searchRateLimitType = new GraphQLObjectType({
  name: 'SearchRateLimit',
  description: 'Info about any rate-limiting for VC earned from search queries',
  fields: () => ({
    limitReached: {
      type: GraphQLBoolean,
      description:
        "Whether we are currently rate-limiting the user's VC earned from searches",
    },
    reason: {
      type: new GraphQLEnumType({
        name: 'SearchRateLimitReason',
        description:
          "Why we are rate-limiting the user's VC earned from searches",
        values: {
          NONE: { value: 'NONE' },
          ONE_MINUTE_MAX: { value: 'ONE_MINUTE_MAX' },
          FIVE_MINUTE_MAX: { value: 'FIVE_MINUTE_MAX' },
          DAILY_MAX: { value: 'DAILY_MAX' },
        },
      }),
    },
    checkIfHuman: {
      type: GraphQLBoolean,
      description: 'Whether we should present the user with a CAPTCHA',
    },
  }),
})

const ExperimentGroupsType = new GraphQLInputObjectType({
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
})

const experimentActionsFields = {
  searchIntro: {
    type: new GraphQLEnumType({
      name: 'ExperimentActionSearchIntro',
      description: 'Action taken in response to the "search intro" experiment.',
      values: {
        NONE: { value: 0 },
        DISMISS: { value: 1 },
        CLICK: { value: 2 },
      },
    }),
  },
  referralNotification: {
    type: new GraphQLEnumType({
      name: 'ExperimentActionReferralNotification',
      description:
        'Action taken in response to the "referral notification" experiment.',
      values: {
        NONE: { value: 0 },
        DISMISS: { value: 1 },
        CLICK: { value: 2 },
      },
    }),
  },
}

const ExperimentActionsType = new GraphQLInputObjectType({
  name: 'ExperimentActions',
  description: 'The actions a user may take in an experiment',
  fields: experimentActionsFields,
})

const ExperimentActionsOutputType = new GraphQLObjectType({
  name: 'ExperimentActionsOutput',
  description: 'The actions a user has taken in an experiment',
  fields: () => experimentActionsFields,
})

// TODO: fetch only the fields we need:
// https://github.com/graphql/graphql-js/issues/19#issuecomment-272857189
const userType = new GraphQLObjectType({
  name: USER,
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField(USER),
    userId: {
      type: GraphQLString,
      description: "Users's username",
      resolve: user => user.id,
    },
    backgroundImage: {
      type: backgroundImageType,
      description: "Users's background image",
    },
    username: {
      type: GraphQLString,
      description: "Users's username",
    },
    email: {
      type: GraphQLString,
      description: "User's email",
    },
    joined: {
      type: GraphQLString,
      description: 'ISO datetime string of when the user joined',
    },
    justCreated: {
      type: GraphQLBoolean,
      description:
        'Whether or not the user was created during this request;' /
        'helpful for a "get or create" mutation',
      resolve: user =>
        // The user will only have the 'justCreated' field when it's a
        // brand new user item
        !!user.justCreated,
    },
    vcCurrent: {
      type: GraphQLInt,
      description: "User's current VC",
    },
    vcAllTime: {
      type: GraphQLInt,
      description: "User's all time VC",
    },
    tabs: {
      type: GraphQLInt,
      description: "User's all time tab count",
    },
    tabsToday: {
      type: GraphQLInt,
      description: "User's tab count for today",
    },
    maxTabsDay: {
      type: maxTabsDayType,
      description: "Info about the user's day of most opened tabs",
      resolve: user => user.maxTabsDay.maxDay,
    },
    level: {
      type: GraphQLInt,
      description: "User's vc",
    },
    // TODO: change to heartsForNextLevel to be able to get progress
    heartsUntilNextLevel: {
      type: GraphQLInt,
      description: 'Remaing hearts until next level.',
    },
    vcDonatedAllTime: {
      type: GraphQLInt,
      description: "User's total vc donated",
    },
    recruits: {
      type: userRecruitsConnection,
      description: 'People recruited by this user',
      args: {
        ...connectionArgs,
        startTime: { type: GraphQLString },
        endTime: { type: GraphQLString },
      },
      resolve: (user, args, context) =>
        connectionFromPromisedArray(
          getRecruits(context.user, user.id, args.startTime, args.endTime),
          args
        ),
    },
    numUsersRecruited: {
      type: GraphQLInt,
      description: 'The number of users this user has recruited',
    },
    widgets: {
      type: widgetConnection,
      description: 'User widgets',
      args: {
        ...connectionArgs,
        enabled: { type: GraphQLBoolean },
      },
      resolve: (user, args, context) =>
        connectionFromPromisedArray(
          getWidgets(context.user, user.id, args.enabled),
          args
        ),
    },
    activeWidget: {
      type: GraphQLString,
      description: "User's active widget id",
    },
    backgroundOption: {
      type: GraphQLString,
      description: "User's background option",
    },
    customImage: {
      type: GraphQLString,
      description: "User's background custom image",
    },
    backgroundColor: {
      type: GraphQLString,
      description: "User's background color",
    },
    mergedIntoExistingUser: {
      type: GraphQLBoolean,
      description:
        'Whether this user was created by an existing user and then merged into the existing user',
    },
    searches: {
      type: GraphQLInt,
      description: "User's all time search count",
    },
    searchesToday: {
      type: GraphQLInt,
      description: "User's search count for today",
    },
    searchRateLimit: {
      type: searchRateLimitType,
      description: 'Info about any search query rate-limiting',
      resolve: (user, args, context) =>
        checkSearchRateLimit(context.user, user.id),
    },
    maxSearchesDay: {
      type: maxSearchesDayType,
      description: "Info about the user's day of most searches",
      resolve: user => user.maxSearchesDay.maxDay,
    },
    experimentActions: {
      type: ExperimentActionsOutputType,
      description: 'Actions the user has taken during experiments',
      resolve: user => constructExperimentActionsType(user),
    },
  }),
  interfaces: [nodeInterface],
})

const userRecruitType = new GraphQLObjectType({
  name: USER_RECRUITS,
  description: 'Info about a user recruited by a referring user',
  fields: () => ({
    // Ideally, we should build the global ID using the composite value of
    // "referringUser" and "userID", which is guaranteed to be unique and can
    // resolve back to one object via the nodeInterface. However, for privacy
    // concerns, we should then also encrypt the userID because we don't want
    // a referrer to know all the IDs of their recruits. For simplicity, we'll
    // just use a compound value of "referringUser" and "recruitedAt", which is
    // almost certainly unique, and just not implement nodeInterface now.
    // https://github.com/graphql/graphql-relay-js/blob/4fdadd3bbf3d5aaf66f1799be3e4eb010c115a4a/src/node/node.js#L138
    id: globalIdField(
      USER_RECRUITS,
      recruit => `${recruit.referringUser}::${recruit.recruitedAt}`
    ),
    recruitedAt: {
      type: GraphQLString,
      description: 'ISO datetime string of when the recruited user joined',
    },
  }),
  // We haven't implemented nodeInterface here because a refetch is unlikely. See above.
  // interfaces: [nodeInterface]
})

const widgetType = new GraphQLObjectType({
  name: WIDGET,
  description: 'App widget',
  fields: () => ({
    id: globalIdField(WIDGET),
    name: {
      type: GraphQLString,
      description: 'Widget display name',
    },
    type: {
      type: GraphQLString,
      description: 'Widget type',
    },
    icon: {
      type: GraphQLString,
      description: 'Widget icon',
    },
    enabled: {
      type: GraphQLBoolean,
      description: 'The Widget enabled state',
    },
    visible: {
      type: GraphQLBoolean,
      description: 'The Widget visible state',
    },
    data: {
      type: GraphQLString,
      description: 'Widget data.',
    },
    config: {
      type: GraphQLString,
      description: 'Widget user specific configuration.',
    },
    settings: {
      type: GraphQLString,
      description: 'Widget general configuration.',
    },
  }),
  interfaces: [nodeInterface],
})

const charityType = new GraphQLObjectType({
  name: CHARITY,
  description: 'A charitable charity',
  fields: () => ({
    id: globalIdField(CHARITY),
    name: {
      type: GraphQLString,
      description: 'the charity name',
    },
    category: {
      type: GraphQLString,
      description: 'the charity category',
    },
    website: {
      type: GraphQLString,
      description: 'the charity website',
    },
    description: {
      type: GraphQLString,
      description: 'the charity description',
    },
    impact: {
      type: GraphQLString,
      description: 'the charity impact message',
    },
    logo: {
      type: GraphQLString,
      description: 'the charity logo image URI',
    },
    image: {
      type: GraphQLString,
      description: 'the charity post-donation image URI',
    },
    imageCaption: {
      type: GraphQLString,
      description: 'An optional caption for the post-donation image',
    },
    vcReceived: {
      type: GraphQLInt,
      description:
        'The number of VC the charity has received in a given time period.',
      args: {
        startTime: { type: GraphQLString },
        endTime: { type: GraphQLString },
      },
      resolve: (charity, args, context) =>
        getCharityVcReceived(
          context.user,
          charity.id,
          args.startTime,
          args.endTime
        ),
    },
  }),
  interfaces: [nodeInterface],
})

const campaignType = new GraphQLObjectType({
  name: 'Campaign',
  description: 'Campaigns (or "charity spotlights") shown to users.',
  fields: () => ({
    campaignId: {
      type: GraphQLString,
      description: 'the ID of the campaign',
    },
    isLive: {
      type: GraphQLBoolean,
      description: 'whether or not the campaign should currently show to users',
    },
  }),
})

const appType = new GraphQLObjectType({
  name: 'App',
  description: 'Global app fields',
  fields: () => ({
    id: globalIdField('App'),
    moneyRaised: {
      type: GraphQLFloat,
      resolve: () => getMoneyRaised(),
    },
    dollarsPerDayRate: {
      type: GraphQLFloat,
      resolve: () => getDollarsPerDayRate(),
    },
    referralVcReward: {
      type: GraphQLInt,
      resolve: () => getReferralVcReward(),
    },
    widgets: {
      type: widgetConnection,
      description: 'All the widgets',
      args: connectionArgs,
      resolve: (_, args, context) =>
        connectionFromPromisedArray(getAllBaseWidgets(context.user), args),
    },
    charity: {
      type: charityType,
      description: 'One of the charities',
      args: {
        charityId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { charityId }, context) =>
        CharityModel.get(context.user, charityId),
    },
    charities: {
      type: charityConnection,
      description: 'All the charities',
      args: {
        ...connectionArgs,
        filters: {
          type: new GraphQLInputObjectType({
            name: 'CharitiesFilters',
            description: 'Fields on which to filter the list of charities.',
            fields: {
              isPermanentPartner: { type: GraphQLBoolean },
            },
          }),
        },
      },
      resolve: (_, args, context) => {
        const { filters } = args
        return connectionFromPromisedArray(
          getCharities(context.user, filters),
          args
        )
      },
    },
    backgroundImages: {
      type: backgroundImageConnection,
      description: 'All the background Images',
      args: connectionArgs,
      resolve: (_, args, context) =>
        connectionFromPromisedArray(
          BackgroundImageModel.getAll(context.user),
          args
        ),
    },
    // Deprecated. Use the campaign object.
    isGlobalCampaignLive: {
      type: GraphQLBoolean,
      resolve: () => isGlobalCampaignLive(),
    },
    campaign: {
      type: campaignType,
      description: 'Campaigns (or "charity spotlights") shown to users.',
      resolve: () => getCampaign(),
    },
  }),
  interfaces: [nodeInterface],
})

const customErrorType = new GraphQLObjectType({
  name: 'CustomError',
  description: 'For expected errors, such as during form validation',
  fields: () => ({
    code: {
      type: GraphQLString,
      description: 'The error code',
    },
    message: {
      type: GraphQLString,
      description: 'The error message',
    },
  }),
})

/**
 * Define your own connection types here.
 * `connectionDefinitions` returns a `connectionType` and its associated `edgeType`.
 * It can contain definitions for "edgeFields" and "connectionFields":
 * https://github.com/graphql/graphql-relay-js/blob/373f2dab5fc6d4ac4cf6394aa94cbebd8cb64650/src/connection/connection.js#L62
 */
const { connectionType: widgetConnection } = connectionDefinitions({
  name: WIDGET,
  nodeType: widgetType,
})
const { connectionType: charityConnection } = connectionDefinitions({
  name: CHARITY,
  nodeType: charityType,
})
const { connectionType: backgroundImageConnection } = connectionDefinitions({
  name: BACKGROUND_IMAGE,
  nodeType: backgroundImageType,
})
const { connectionType: userRecruitsConnection } = connectionDefinitions({
  name: USER_RECRUITS,
  // Note: this could reasonably just be a userType instead, but creating a
  // separate type gives us an extra layer of protection against accidentally
  // leaking recruits' user data-- at least until our permissions system is
  // more sophisticated.
  nodeType: userRecruitType,
  connectionFields: {
    totalRecruits: {
      type: GraphQLInt,
      description: 'The count of users recruited (signed up)',
      resolve: connection => getTotalRecruitsCount(connection.edges),
    },
    recruitsActiveForAtLeastOneDay: {
      type: GraphQLInt,
      description:
        'The count of users recruited who remained active for one day or more',
      resolve: connection =>
        getRecruitsActiveForAtLeastOneDay(connection.edges),
    },
  },
})

/**
 * Log a tab, update VC, and change related stats.
 */
const logTabMutation = mutationWithClientMutationId({
  name: 'LogTab',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    tabId: { type: GraphQLString },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, tabId }, context) => {
    const { id } = fromGlobalId(userId)
    return logTab(context.user, id, tabId)
  },
})

/**
 * Log a search, update VC, and change related stats.
 */
const logSearchMutation = mutationWithClientMutationId({
  name: 'LogSearch',
  inputFields: {
    // Note that this is the raw user ID (not the Relay global).
    userId: { type: new GraphQLNonNull(GraphQLString) },
    source: { type: GraphQLString },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, ...additionalData }, context) =>
    logSearch(context.user, userId, additionalData),
})

/**
 * Log a click on a user's referral link.
 */
const logReferralLinkClickMutation = mutationWithClientMutationId({
  name: 'LogReferralLinkClick',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: ({ userId }, context) => {
    const { id } = fromGlobalId(userId)
    return logReferralLinkClick(context.user, id)
  },
})

/**
 * Log earned revenue for a user
 */

const EncodedRevenueValueType = new GraphQLInputObjectType({
  name: 'EncodedRevenueValue',
  description: 'An object representing a single revenue value',
  fields: {
    encodingType: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: 'EncodedRevenueValueTypeEnum',
          description:
            'The type of transformation we should use to resolve the object into a revenue value',
          values: {
            AMAZON_CPM: { value: 'AMAZON_CPM' },
          },
        })
      ),
    },
    encodedValue: {
      description:
        'A string that we can decode to a revenue value (float) using the "encodingType" method',
      type: new GraphQLNonNull(GraphQLString),
    },
    adSize: { type: GraphQLString },
  },
})

const logUserRevenueMutation = mutationWithClientMutationId({
  name: 'LogUserRevenue',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    revenue: { type: GraphQLFloat },
    // Separate fields because graphql-js doesn't yet allow GraphQLUnionType
    // in input fields:
    // https://github.com/graphql/graphql-js/issues/207
    encodedRevenue: {
      description:
        'A revenue value encoded because it is not available on the client side',
      type: EncodedRevenueValueType,
    },
    // Required if both "revenue" and "encodedRevenue" fields are present.
    aggregationOperation: {
      type: new GraphQLEnumType({
        name: 'LogUserRevenueAggregationOperationEnum',
        description:
          'The operation to use to resolve multiple values into a final revenue value. ' /
          'We currently only support "MAX".',
        values: {
          MAX: { value: 'MAX' },
        },
      }),
    },
    dfpAdvertiserId: { type: GraphQLString },
    adUnitCode: { type: GraphQLString },
    tabId: { type: GraphQLString },
    adSize: { type: GraphQLString },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: (
    {
      userId,
      revenue,
      dfpAdvertiserId,
      encodedRevenue,
      aggregationOperation,
      tabId,
      adSize,
      adUnitCode,
    },
    context
  ) => {
    const { id } = fromGlobalId(userId)
    return logRevenue(
      context.user,
      id,
      revenue,
      dfpAdvertiserId,
      encodedRevenue,
      aggregationOperation,
      tabId,
      adSize,
      adUnitCode
    )
  },
})

/**
 * Donate to a charity.
 */
const donateVcMutation = mutationWithClientMutationId({
  name: 'DonateVc',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    charityId: { type: new GraphQLNonNull(GraphQLString) },
    vc: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: data => data.user,
    },
    errors: {
      type: new GraphQLList(customErrorType),
      resolve: data => data.errors,
    },
  },
  mutateAndGetPayload: ({ userId, charityId, vc }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const charityGlobalObj = fromGlobalId(charityId)
    return donateVc(context.user, userGlobalObj.id, charityGlobalObj.id, vc)
  },
})

/**
 * Set user background image mutation.
 */
const setUserBkgImageMutation = mutationWithClientMutationId({
  name: 'SetUserBkgImage',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    imageId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, imageId }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const bckImageGlobalObj = fromGlobalId(imageId)
    return setBackgroundImage(
      context.user,
      userGlobalObj.id,
      bckImageGlobalObj.id
    )
  },
})

/**
 * Set user background color mutation.
 */
const setUserBkgColorMutation = mutationWithClientMutationId({
  name: 'SetUserBkgColor',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    color: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, color }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setBackgroundColor(context.user, userGlobalObj.id, color)
  },
})

/**
 * Set user background custom image mutation.
 */
const setUserBkgCustomImageMutation = mutationWithClientMutationId({
  name: 'SetUserBkgCustomImage',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, image }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setBackgroundImageFromCustomURL(
      context.user,
      userGlobalObj.id,
      image
    )
  },
})

/**
 * Set user background daily image.
 */
const setUserBkgDailyImageMutation = mutationWithClientMutationId({
  name: 'SetUserBkgDailyImage',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setBackgroundImageDaily(context.user, userGlobalObj.id)
  },
})

/**
 * Set user background daily image.
 */
const setUserActiveWidgetMutation = mutationWithClientMutationId({
  name: 'SetUserActiveWidget',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, widgetId }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    // FIXME: widgetId should use `fromGlobalId` first. Note that
    // the active widget ID in the database for existing users is
    // currently using the global ID, so any change must be
    // backwards-compatible.
    return setActiveWidget(context.user, userGlobalObj.id, widgetId)
  },
})

/**
 * Update widget data.
 */
const updateWidgetDataMutation = mutationWithClientMutationId({
  name: 'UpdateWidgetData',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: userWidget => userWidget,
    },
  },
  mutateAndGetPayload: ({ userId, widgetId, data }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateWidgetData(
      context.user,
      userGlobalObj.id,
      widgetGlobalObj.id,
      data
    )
  },
})

/**
 * Update widget visibility.
 */
const updateWidgetVisibilityMutation = mutationWithClientMutationId({
  name: 'UpdateWidgetVisibility',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    visible: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: userWidget => userWidget,
    },
  },
  mutateAndGetPayload: ({ userId, widgetId, visible }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateWidgetVisibility(
      context.user,
      userGlobalObj.id,
      widgetGlobalObj.id,
      visible
    )
  },
})

/**
 * Update widget enable.
 */
const updateWidgetEnabledMutation = mutationWithClientMutationId({
  name: 'UpdateWidgetEnabled',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    enabled: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: userWidget => userWidget,
    },
  },
  mutateAndGetPayload: ({ userId, widgetId, enabled }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateWidgetEnabled(
      context.user,
      userGlobalObj.id,
      widgetGlobalObj.id,
      enabled
    )
  },
})

/**
 * Update widget config.
 */
const updateWidgetConfigMutation = mutationWithClientMutationId({
  name: 'UpdateWidgetConfig',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    widgetId: { type: new GraphQLNonNull(GraphQLString) },
    config: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    widget: {
      type: widgetType,
      resolve: userWidget => userWidget,
    },
  },
  mutateAndGetPayload: ({ userId, widgetId, config }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    const widgetGlobalObj = fromGlobalId(widgetId)
    return updateWidgetConfig(
      context.user,
      userGlobalObj.id,
      widgetGlobalObj.id,
      config
    )
  },
})

const ReferralDataInput = new GraphQLInputObjectType({
  name: 'ReferralData',
  fields: {
    referringUser: { type: GraphQLString },
    referringChannel: { type: GraphQLString },
  },
})

/**
 * Create a new user. This must be idempotent, as the client
 * might call it for existing users upon sign-in.
 */
const createNewUserMutation = mutationWithClientMutationId({
  name: 'CreateNewUser',
  inputFields: {
    // Note that this is the raw user ID (not the Relay global).
    userId: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
    referralData: { type: ReferralDataInput },
    experimentGroups: { type: ExperimentGroupsType },
    extensionInstallId: { type: GraphQLString },
    extensionInstallTimeApprox: { type: GraphQLString },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: (
    {
      userId,
      email,
      referralData,
      experimentGroups,
      extensionInstallId,
      extensionInstallTimeApprox,
    },
    context
  ) =>
    createUser(
      context.user,
      userId,
      email,
      referralData,
      experimentGroups,
      extensionInstallId,
      extensionInstallTimeApprox
    ),
})

/**
 * Update one or more of a user's experiment groups.
 */
const updateUserExperimentGroupsMutation = mutationWithClientMutationId({
  name: 'UpdateUserExperimentGroups',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    experimentGroups: { type: ExperimentGroupsType },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, experimentGroups }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return logUserExperimentGroups(
      context.user,
      userGlobalObj.id,
      experimentGroups
    )
  },
})

/**
 * Log action a user takes in an experiment.
 */
const logUserExperimentActionsMutation = mutationWithClientMutationId({
  name: 'LogUserExperimentActions',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    experimentActions: { type: ExperimentActionsType },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, experimentActions }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return logUserExperimentActions(
      context.user,
      userGlobalObj.id,
      experimentActions
    )
  },
})

const setUsernameMutation = mutationWithClientMutationId({
  name: 'SetUsername',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: data => data.user,
    },
    errors: {
      type: new GraphQLList(customErrorType),
      resolve: data => data.errors,
    },
  },
  mutateAndGetPayload: ({ userId, username }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setUsername(context.user, userGlobalObj.id, username)
  },
})

/**
 * Handle when a user is a duplicate account for an existing user.
 */
const mergeIntoExistingUserMutation = mutationWithClientMutationId({
  name: 'MergeIntoExistingUser',
  inputFields: {
    // Note that this is the raw user ID (not the Relay global).
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: ({ userId }, context) =>
    mergeIntoExistingUser(context.user, userId),
})

/**
 * Log when a user verifies their email on the client side.
 */
const logEmailVerifiedMutation = mutationWithClientMutationId({
  name: 'LogEmailVerifiedMutation',
  inputFields: {
    // Note that this is the raw user ID (not the Relay global).
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
    },
  },
  mutateAndGetPayload: ({ userId }, context) =>
    logEmailVerified(context.user, userId),
})

/**
 * Log a data consent action (e.g. for GDPR).
 */
const logUserDataConsentMutation = mutationWithClientMutationId({
  name: 'LogUserDataConsent',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    consentString: { type: new GraphQLNonNull(GraphQLString) },
    isGlobalConsent: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: (
    { userId, consentString, isGlobalConsent },
    context
  ) => {
    const { id } = fromGlobalId(userId)
    return logUserDataConsent(context.user, id, consentString, isGlobalConsent)
  },
})

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    app: {
      type: appType,
      resolve: () => App.getApp(1),
    },
    user: {
      type: userType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args, context) => UserModel.get(context.user, args.userId),
    },
  }),
})

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    logTab: logTabMutation,
    logSearch: logSearchMutation,
    logUserRevenue: logUserRevenueMutation,
    logUserDataConsent: logUserDataConsentMutation,
    donateVc: donateVcMutation,
    mergeIntoExistingUser: mergeIntoExistingUserMutation,
    logEmailVerified: logEmailVerifiedMutation,
    logReferralLinkClick: logReferralLinkClickMutation,

    setUserBkgImage: setUserBkgImageMutation,
    setUserBkgColor: setUserBkgColorMutation,
    setUserBkgCustomImage: setUserBkgCustomImageMutation,
    setUserBkgDailyImage: setUserBkgDailyImageMutation,

    updateWidgetData: updateWidgetDataMutation,
    updateWidgetVisibility: updateWidgetVisibilityMutation,
    updateWidgetEnabled: updateWidgetEnabledMutation,
    updateWidgetConfig: updateWidgetConfigMutation,

    setUserActiveWidget: setUserActiveWidgetMutation,

    createNewUser: createNewUserMutation,
    setUsername: setUsernameMutation,
    updateUserExperimentGroups: updateUserExperimentGroupsMutation,
    logUserExperimentActions: logUserExperimentActionsMutation,
  }),
})

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
// eslint-disable-next-line import/prefer-default-export
export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
})
