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
  CAUSE,
  BACKGROUND_IMAGE,
  USER_IMPACT,
  USER_RECRUITS,
  INVITED_USERS,
  MISSION,
  VIDEO_AD_LOG,
  USER_EXPERIMENT,
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
import setEmail from '../database/users/setEmail'
import logEmailVerified from '../database/users/logEmailVerified'
import logTab from '../database/users/logTab'
import updateImpact from '../database/userImpact/updateImpact'
import getUserImpact from '../database/userImpact/getUserImpact'
import createInvitedUsers from '../database/invitedUsers/createInvitedUsers'
import createSquadInvite from '../database/missions/inviteUserToMission'
import logSearch from '../database/users/logSearch'
import checkSearchRateLimit from '../database/users/checkSearchRateLimit'
import logRevenue from '../database/userRevenue/logRevenue'
import logUserDataConsent from '../database/userDataConsent/logUserDataConsent'
import mergeIntoExistingUser from '../database/users/mergeIntoExistingUser'
import setActiveWidget from '../database/users/setActiveWidget'
import getBackgroundImage from '../database/users/getBackgroundImage'
import setBackgroundImage from '../database/users/setBackgroundImage'
import setBackgroundImageFromCustomURL from '../database/users/setBackgroundImageFromCustomURL'
import setBackgroundColor from '../database/users/setBackgroundColor'
import setBackgroundImageDaily from '../database/users/setBackgroundImageDaily'
import logUserExperimentGroups from '../database/users/logUserExperimentGroups'
import logUserExperimentActions from '../database/users/logUserExperimentActions'
import constructExperimentActionsType from '../database/users/constructExperimentActionsType'
import setUserCause from '../database/users/setUserCause'
import logReferralLinkClick from '../database/referrals/logReferralLinkClick'
import setV4Enabled from '../database/users/setV4Enabled'
import setHasViewedIntroFlow from '../database/users/setHasViewedIntroFlow'
import deleteUser from '../database/users/deleteUser'
import getOrCreateTruexId from '../database/users/getOrCreateTruexId'
import squadInviteResponse from '../database/missions/squadInviteResponse'
import updateMissionNotification from '../database/missions/updateMissionNotification'
import setHasSeenCompletedMission from '../database/missions/hasSeenCompletedMission'
import restartMission from '../database/missions/restartMission'
import setHasSeenSquads from '../database/users/setHasSeenSquads'
import setYahooSearchOptIn from '../database/users/setYahooSearchOptIn'
import setUserSearchEngine from '../database/users/setUserSearchEngine'
import createSearchEnginePromptLog from '../database/users/createSearchEnginePromptLog'

import CharityModel from '../database/charities/CharityModel'
import getCharities from '../database/charities/getCharities'

import getCauseByUser from '../database/cause/getCauseByUser'
import getCause from '../database/cause/getCause'
import getCauses from '../database/cause/getCauses'
import CauseModel from '../database/cause/CauseModel'
import VideoAdLogModel from '../database/videoAdLog/VideoAdLogModel'
import createVideoAdLog from '../database/videoAdLog/createVideoAdLog'
import logVideoAdComplete from '../database/videoAdLog/logVideoAdCompleted'
import isVideoAdEligible from '../database/videoAdLog/isVideoAdEligible'
import UserImpactModel from '../database/userImpact/UserImpactModel'
import donateVc from '../database/donations/donateVc'
import getCharityVcReceived from '../database/donations/getCharityVcReceived'
import InvitedUsersModel from '../database/invitedUsers/InvitedUsersModel'
import BackgroundImageModel from '../database/backgroundImages/BackgroundImageModel'
import getBackgroundImages from '../database/backgroundImages/getBackgroundImages'
import getCurrentUserMission from '../database/missions/getCurrentUserMission'
import getPastUserMissions from '../database/missions/getPastUserMissions'
import {
  getLongestTabStreak,
  getCurrentTabStreak,
  getMaxTabsDay,
  getMissionCurrentTabsDay,
} from '../database/missions/utils'
import createMission from '../database/missions/createMission'
import UserExperimentModel from '../database/experiments/UserExperimentModel'

// eslint-disable-next-line import/no-named-as-default
import getRecruits, {
  getTotalRecruitsCount,
  getRecruitsActiveForAtLeastOneDay,
  getRecruitsWithAtLeastOneTab,
} from '../database/referrals/getRecruits'

import {
  getMoneyRaised,
  getReferralVcReward,
  getDollarsPerDayRate,
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
const getMission = () => {}
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
    if (type === MISSION) {
      return getMission(context.user, id)
    }
    if (type === CHARITY) {
      return CharityModel.get(context.user, id)
    }
    if (type === USER_IMPACT) {
      return UserImpactModel.get(context.user, id)
    }
    if (type === INVITED_USERS) {
      return InvitedUsersModel.get(context.user, id)
    }
    if (type === BACKGROUND_IMAGE) {
      return BackgroundImageModel.get(context.user, id)
    }
    if (type === VIDEO_AD_LOG) {
      return VideoAdLogModel.get(context.user, id)
    }
    if (type === USER_EXPERIMENT) {
      return UserExperimentModel.get(context.user, id)
    }
    if (type === CAUSE) {
      return getCause(id)
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
    if (obj instanceof UserImpactModel) {
      return userImpactType
    }
    if (obj instanceof InvitedUsersModel) {
      return invitedUsersType
    }
    if (obj instanceof BackgroundImageModel) {
      // eslint-disable-next-line no-use-before-define
      return backgroundImageType
    }
    if (obj instanceof VideoAdLogModel) {
      // eslint-disable-next-line no-use-before-define
      return videoAdLogType
    }
    if (obj instanceof CauseModel) {
      return CauseType
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
    category: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the category that the image falls into',
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
      resolve: (user, _args, context) => getBackgroundImage(context.user, user),
    },
    userImpact: {
      type: userImpactType,
      description:
        "A user's cause-specific impact for the cause they are currently supporting",
      resolve: async (user, _args, context) =>
        getUserImpact(context.user, user.id),
    },
    username: {
      type: GraphQLString,
      description: "Users's username",
    },
    email: {
      type: GraphQLString,
      description: "User's email",
    },
    truexId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'a unique user ID sent to video ad partner truex',
      resolve: (user, _args, context) => getOrCreateTruexId(context.user, user),
    },
    cause: {
      type: CauseType,
      description: 'cause type for the user',
      resolve: (user, _args, context) => getCauseByUser(context.user, user.id),
    },
    videoAdEligible: {
      type: GraphQLBoolean,
      description:
        'whether a user has completed 3 video ads in the last 24 hours',
      resolve: (user, _args, context) => isVideoAdEligible(context.user, user),
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
    v4BetaEnabled: {
      type: GraphQLBoolean,
      description: 'If true, serve the new Tab V4 app.',
    },
    hasViewedIntroFlow: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'if true, user has viewed intro flow in v4',
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
    currentMission: {
      type: MissionType,
      description: 'the current active mission for a user',
      resolve: user => getCurrentUserMission(user),
    },
    pastMissions: {
      type: MissionsConnection,
      description: 'gets all the past missions for a user',
      args: connectionArgs,
      resolve: (user, args) => {
        return connectionFromPromisedArray(getPastUserMissions(user), args)
      },
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
    notifications: {
      type: new GraphQLNonNull(
        GraphQLList(
          new GraphQLObjectType({
            name: 'notifications',
            description: 'user notifications to show on v4',
            fields: () => ({
              code: {
                type: GraphQLString,
                description: 'the kind of notification it is',
              },
            }),
          })
        )
      ),
      description: 'notifications for the v4 user to see',
      resolve: () => {
        if (process.env.SHOW_NOTIF_INTL_CAT_DAY_END_2021 === 'true') {
          return [{ code: 'intlCatDayEnd2021' }]
        }
        return []
      },
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
    pendingMissionInvites: {
      type: new GraphQLNonNull(
        GraphQLList(
          new GraphQLObjectType({
            name: 'PendingMissionInvite',
            description: 'pending mission invites for user',
            fields: () => ({
              missionId: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'the mission id of the squad invite',
              },
              invitingUser: {
                type: new GraphQLObjectType({
                  name: 'InvitingUser',
                  description: 'inviting user',
                  fields: () => ({
                    name: {
                      type: new GraphQLNonNull(GraphQLString),
                      description: 'the name entered in invite',
                    },
                  }),
                }),
              },
            }),
          })
        )
      ),
    },
    hasSeenSquads: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'whether a v4 user has been introduced to squads in the ui',
    },
  }),
  interfaces: [nodeInterface],
})
const CauseImpactCopy = new GraphQLObjectType({
  name: 'CauseSpecificImpactUI',
  description: 'cause specific UI content around impact',
  fields: () => ({
    impactCounterText: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'markdown string: copy for ImpactCounter for normal case',
    },
    referralRewardTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'markdown string: title copy for referralReward UserImpact modal',
    },
    referralRewardSubtitle: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'markdown string: subtitle copy for referralReward UserImpact modal',
    },
    referralRewardNotification: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'markdown string: copy for referral reward notification',
    },
    claimImpactTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'markdown string: title for claimImpact notification in UserImpact',
    },
    claimImpactSubtitle: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'markdown string: subtitle for claimImpact notification in UserImpact',
    },
    impactIcon: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'string: name of the icon to use in impact counter',
    },
    walkMeGif: {
      type: GraphQLString,
      description: 'file name of the cause GIF to use during onboarding',
    },
    newlyReferredImpactWalkthroughText: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'markdown string: copy for impact walkthrough notification in UserImpact when user is referred',
    },
    impactWalkthroughText: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'markdown string: copy for impact walkthrough notification in UserImpact',
    },
    confirmImpactSubtitle: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'markdown string: copy for confirm impact modal in UserImpact',
    },
  }),
})

const CauseThemeType = new GraphQLObjectType({
  name: 'CauseTheming',
  description: 'css properties for a specific cause',
  fields: () => ({
    primaryColor: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the primary color hex value',
    },
    secondaryColor: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the secondary color hex value',
    },
  }),
})

const CauseSharingCopyType = new GraphQLObjectType({
  name: 'SharingUICopy',
  description: 'cause specific UI content around sharing',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'markdown for modal title',
    },
    subtitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'markdown for modal subtitle',
    },
    imgCategory: {
      type: new GraphQLNonNull(GraphQLString),
      description: `value to use for img switch statement on frontend, probably ‘cats’ or ‘seas’`,
    },
    shareImage: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Image to use in email invite dialog',
    },
    sentImage: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Image shown after email invite sent',
    },
    redditButtonTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for reddit button',
    },
    facebookButtonTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for facebook button',
    },
    twitterButtonTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for twitter button',
    },
    tumblrTitle: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for tumblr button',
    },
    tumblrCaption: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'copy for tumblr caption',
    },
  }),
})
const CauseOnboardingCopyType = new GraphQLObjectType({
  name: 'OnboardingUICopy',
  description: 'cause specific UI content around onboarding',
  fields: () => ({
    steps: {
      type: new GraphQLNonNull(
        GraphQLList(
          new GraphQLObjectType({
            name: 'onboardingUIStep',
            description: 'ui content for each onboarding step',
            fields: () => ({
              title: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'markdown title for onboarding step',
              },
              subtitle: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'markdown subtitle for onboarding step',
              },
              imgName: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'name of image to show',
              },
            }),
          })
        )
      ),
      description: 'the steps array in onboarding',
      resolve: onboarding => onboarding.steps,
    },
    firstTabIntroDescription: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: onboarding => onboarding.firstTabIntroDescription,
      description:
        'markdown string shown when prompting the user to open their first tab, currently info about cat treats',
    },
  }),
})
const CauseType = new GraphQLObjectType({
  name: CAUSE,
  description: 'all cause specific data and ui content',
  fields: () => ({
    id: globalIdField(CAUSE),
    about: {
      type: new GraphQLNonNull(GraphQLString),
      description: `Markdown - content that populates an "About the Cause" page`,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: `String used to describe cause in account page`,
    },
    isAvailableToSelect: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'boolean if cause is available to select in ui',
    },
    causeId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Cause's id",
      resolve: cause => cause.id,
    },
    icon: {
      type: new GraphQLNonNull(GraphQLString),
      description: `Name of an icon, mapping to an icon component on the frontend`,
    },
    landingPagePath: {
      type: new GraphQLNonNull(GraphQLString),
      description: `URL path for the landing page belonging to this cause`,
    },
    individualImpactEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: `Whether or not the current cause supports individual impact`,
    },
    impactVisits: {
      type: GraphQLInt,
      description: `number of visits required for each impact unit (e.g. 14 for cat charity)`,
    },
    impact: {
      type: CauseImpactCopy,
      description: 'the impact object on cause model',
      resolve: cause => cause.impact,
    },
    theme: {
      type: new GraphQLNonNull(CauseThemeType),
      description: 'the theme object on cause model',
      resolve: cause => cause.theme,
    },
    sharing: {
      type: new GraphQLNonNull(CauseSharingCopyType),
      description: 'the sharing object on cause model',
      resolve: cause => cause.sharing,
    },
    onboarding: {
      type: new GraphQLNonNull(CauseOnboardingCopyType),
      resolve: cause => cause.onboarding,
      description: 'the onboarding object on cause model',
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

const videoAdLogType = new GraphQLObjectType({
  name: VIDEO_AD_LOG,
  description: 'Video Ad Log type',
  fields: () => ({
    id: globalIdField(VIDEO_AD_LOG),
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
const userImpactType = new GraphQLObjectType({
  name: USER_IMPACT,
  description: `a user's charity specific impact`,
  fields: () => ({
    id: globalIdField(
      USER_IMPACT,
      userImpact => `${userImpact.userId}::${userImpact.charityId}`
    ),
    userId: { type: new GraphQLNonNull(GraphQLString) },
    charityId: { type: new GraphQLNonNull(GraphQLString) },
    userImpactMetric: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'a users impact for a specific charity',
    },
    pendingUserReferralImpact: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'a users pending impact based on referrals',
    },
    pendingUserReferralCount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'pending user referral count',
    },
    visitsUntilNextImpact: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'visits remaining until next recorded impact',
    },
    confirmedImpact: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'enables a user to start accruing impact',
    },
    hasClaimedLatestReward: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'flag that indicates if user has celebrated latest impact',
    },
  }),
})
const invitedUsersType = new GraphQLObjectType({
  name: INVITED_USERS,
  description: `a record of a user email inviting someone`,
  fields: () => ({
    id: globalIdField(
      INVITED_USERS,
      invitedUsers => `${invitedUsers.inviterId}::${invitedUsers.invitedEmail}`
    ),
    inviterId: { type: new GraphQLNonNull(GraphQLString) },
    invitedEmail: { type: new GraphQLNonNull(GraphQLString) },
    invitedId: {
      type: GraphQLString,
      description: 'invited users id once user has successfully signed up',
    },
  }),
})
const campaignContentType = new GraphQLObjectType({
  name: 'CampaignContent',
  description: 'Text content for campaigns',
  fields: () => ({
    titleMarkdown: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The campaign title, using markdown',
    },
    descriptionMarkdown: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The primary campaign text content (paragraphs, links, etc.), using markdown',
    },
    descriptionMarkdownTwo: {
      type: GraphQLString,
      description:
        'Additional campaign text content (paragraphs, links, etc.), using markdown',
    },
  }),
})

const campaignTimeType = new GraphQLObjectType({
  name: 'CampaignTime',
  description: 'The start and end times (in ISO timestamps) for the campaign',
  fields: () => ({
    start: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The start time of the campaign as an ISO timestamp',
    },
    end: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The end time of the campaign as an ISO timestamp',
    },
  }),
})

const campaignGoalType = new GraphQLObjectType({
  name: 'CampaignGoal',
  description:
    'Information on progress toward a target impact goal for the campaign',
  fields: () => ({
    targetNumber: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The goal number of whatever impact units the campaign is hoping to achieve',
    },
    currentNumber: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The current number of whatever impact units the campaign is hoping to achieve',
    },
    impactUnitSingular: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The English word for the impact unit, singular (e.g. Heart, dollar, puppy)',
    },
    impactUnitPlural: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The English word for the impact unit, plural (e.g. Hearts, dollars, puppies)',
    },
    impactVerbPastParticiple: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The past-tense participle English verb that describes achieving the impact unit (e.g. given, raised, adopted)',
    },
    impactVerbPastTense: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The simple past-tense English verb that describes achieving the impact unit (e.g. gave, raised, adopted)',
    },
    limitProgressToTargetMax: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'If true, do not display a currentNumber greater than the targetNumber. Instead, limit goal progress to 100% of the target.',
    },
    showProgressBarLabel: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether the progress bar should have labels of the current number and goal number',
    },
    showProgressBarEndText: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether the progress bar should have an end-of-campaign summary text of the progress',
    },
  }),
})

const campaignSocialSharingType = new GraphQLObjectType({
  name: 'CampaignSocialSharing',
  description:
    'Information on progress toward a target impact goal for the campaign',
  fields: () => ({
    url: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The URL to share',
    },
    EmailShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingEmailProps',
        description: 'Props for the email social sharing button',
        fields: () => ({
          subject: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The email subject',
          },
          body: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The email body',
          },
        }),
      }),
      description: 'Props for the email social sharing button',
    },
    FacebookShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingFacebookProps',
        description: 'Props for the Facebook social sharing button',
        fields: () => ({
          quote: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The text to share to Facebook',
          },
        }),
      }),
      description: 'Props for the Facebook social sharing button',
    },
    RedditShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingRedditProps',
        description: 'Props for the Reddit social sharing button',
        fields: () => ({
          title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The text to share to Reddit',
          },
        }),
      }),
      description: 'Props for the Reddit social sharing button',
    },
    TumblrShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingTumblrProps',
        description: 'Props for the Tumblr social sharing button',
        fields: () => ({
          title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The Tumblr title',
          },
          caption: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The Tumblr caption',
          },
        }),
      }),
      description: 'Props for the Tumblr social sharing button',
    },
    TwitterShareButtonProps: {
      type: new GraphQLObjectType({
        name: 'CampaignSocialSharingTwitterProps',
        description: 'Props for the Twitter social sharing button',
        fields: () => ({
          title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The text to share to Twitter',
          },
          related: {
            type: new GraphQLNonNull(GraphQLList(GraphQLString)),
            description: 'A list of Twitter handles that relate to the post',
          },
        }),
      }),
      description: 'Props for the Twitter social sharing button',
    },
  }),
})

const campaignThemeType = new GraphQLObjectType({
  name: 'CampaignTheme',
  description: 'Theming/styling for the campaign',
  fields: () => ({
    color: {
      type: new GraphQLObjectType({
        name: 'CampaignThemeColor',
        description: 'Color theming for the campaign',
        fields: () => ({
          main: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The primary color for the theme',
          },
          light: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The lighter color for the theme',
          },
        }),
      }),
      description:
        'The goal number of whatever impact units the campaign is hoping to achieve',
    },
  }),
})

const campaignType = new GraphQLObjectType({
  name: 'Campaign',
  description: 'Campaigns (or "charity spotlights") shown to users.',
  fields: () => ({
    campaignId: {
      type: GraphQLString,
      description: 'The ID of the campaign',
    },
    charity: {
      type: charityType,
      description: 'The charity that this campaign features',
    },
    content: {
      type: new GraphQLNonNull(campaignContentType),
      description: 'The text content for the campaign',
    },
    // Deprecated.
    endContent: {
      type: campaignContentType,
      deprecationReason:
        'The content returned by the server will automatically change when the campaign ends.',
      description:
        'The text content for the campaign when it has finished (past the end time)',
    },
    isLive: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not the campaign should currently show to users',
    },
    goal: {
      type: campaignGoalType,
      description:
        'Information on progress toward a target impact goal for the campaign',
    },
    // Deprecated.
    numNewUsers: {
      type: GraphQLInt,
      deprecationReason: 'Replaced by the generalized"goal" data.',
      description: 'The number of new users who joined during this campaign.',
    },
    showCountdownTimer: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether to show a countdown timer for when the campaign will end',
    },
    showHeartsDonationButton: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether to show a button to donate hearts to the charity featured in the campaign -- which requires the "charity " field to be defined',
    },
    showProgressBar: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Whether to show a progress bar -- which requires the "goal" field to be defined',
    },
    showSocialSharing: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether to show social sharing buttons',
    },
    socialSharing: {
      type: campaignSocialSharingType,
      description: 'Social sharing buttons',
    },
    theme: {
      type: campaignThemeType,
      description: 'Theming/style for the campaign',
    },
    time: {
      type: new GraphQLNonNull(campaignTimeType),
      description:
        'The start and end times (in ISO timestamps) for the campaign',
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
    causes: {
      type: causeConnection,
      description: 'All the causes',
      args: {
        ...connectionArgs,
        filters: {
          type: new GraphQLInputObjectType({
            name: 'CausesFilters',
            description: 'Fields on which to filter the list of charities.',
            fields: {
              isAvailableToSelect: { type: GraphQLBoolean },
            },
          }),
        },
      },
      resolve: (_, args, context) => {
        const { filters } = args
        return connectionFromPromisedArray(
          getCauses(context.user, filters),
          args
        )
      },
    },
    backgroundImages: {
      type: backgroundImageConnection,
      description: 'Get all the "legacy" (uncategorized) background Images',
      args: connectionArgs,
      resolve: (_, args, context) =>
        connectionFromPromisedArray(getBackgroundImages(context.user), args),
    },
    campaign: {
      type: campaignType,
      description: 'Campaigns (or "charity spotlights") shown to users.',
      resolve: (_, args, context) => getCampaign(context.user),
    },
  }),
  interfaces: [nodeInterface],
})

// corresponds to UserMission table
const SquadMemberInfo = new GraphQLObjectType({
  name: 'SquadMemberInfo',
  description: "an individual's stats for a mission",
  fields: () => ({
    username: {
      type: GraphQLString,
      description: "Users's username if they have joined TFAC",
    },
    invitedEmail: {
      type: GraphQLString,
      description: "Users's invited email if they have not joined TFAC",
    },
    status: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: 'squadAcceptedStatus',
          description:
            'whether a user has accepted rejected or is pending invitation',
          values: {
            pending: { value: 'pending' },
            accepted: { value: 'accepted' },
            rejected: { value: 'rejected' },
          },
        })
      ),
    },
    longestTabStreak: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the longest tab streak in days so far',
      resolve: squadMember => getLongestTabStreak(squadMember),
    },
    currentTabStreak: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the current tab streak in days so far',
      resolve: squadMember => getCurrentTabStreak(squadMember),
    },

    missionMaxTabsDay: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the most tabs in a single day',
      resolve: squadMember => getMaxTabsDay(squadMember),
    },
    missionCurrentTabsDay: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the current tabs today',
      resolve: squadMember => getMissionCurrentTabsDay(squadMember),
    },
    tabs: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'users tab contribution',
    },
  }),
})

const EndOfMissionAward = new GraphQLObjectType({
  name: 'EndOfMissionAward',
  description: 'persistant awards calculated at end of mission',
  fields: () => ({
    user: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'users ID',
    },
    awardType: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the string name of the particular award',
    },
    unit: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the numerical stat for the award, such as number of tabs',
    },
  }),
})

// mostly corresponds to Mission table, rolls up stats
const MissionType = new GraphQLObjectType({
  name: 'Mission',
  description: 'A goal that Tabbers complete with a group of friends',
  fields: () => ({
    missionId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Mission ID',
    },
    status: {
      type: new GraphQLNonNull(
        new GraphQLEnumType({
          name: 'missionStatus',
          description:
            'whether a user has accepted rejected or is pending invitation',
          values: {
            pending: { value: 'pending' },
            started: { value: 'started' },
            completed: { value: 'completed' },
          },
        })
      ),
      description:
        'the current status of the current mission - pending, started, completed',
    },
    squadName: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the name of the squad',
    },
    // sending these both down and calculating on the front end so we can see percent move
    tabGoal: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the number of tabs to complete mission',
    },
    tabCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "the sum of users' number of tabs towards mission",
    },
    acknowledgedMissionComplete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'if a user has acknowledged mission complete',
    },
    acknowledgedMissionStarted: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'if a user has acknowledged mission started',
    },
    squadMembers: {
      description: 'stats and state of each squad member',
      type: new GraphQLNonNull(new GraphQLList(SquadMemberInfo)),
    },
    endOfMissionAwards: {
      type: new GraphQLNonNull(new GraphQLList(EndOfMissionAward)),
      description:
        'the end of mission awards calculated when mission completes',
    },
    started: {
      type: GraphQLString,
      description: 'ISO datetime string of when the mission started',
    },
    completed: {
      type: GraphQLString,
      description: 'ISO datetime string of when the mission completed',
    },
  }),
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
const { connectionType: causeConnection } = connectionDefinitions({
  name: CAUSE,
  nodeType: CauseType,
})
const { connectionType: backgroundImageConnection } = connectionDefinitions({
  name: BACKGROUND_IMAGE,
  nodeType: backgroundImageType,
})
const { connectionType: MissionsConnection } = connectionDefinitions({
  name: MISSION,
  nodeType: MissionType,
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
    recruitsWithAtLeastOneTab: {
      type: GraphQLInt,
      description:
        'The count of users recruited who have opened one tab or more',
      resolve: connection => getRecruitsWithAtLeastOneTab(connection.edges),
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
    isV4: { type: GraphQLBoolean },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, tabId, isV4 }, context) => {
    const { id } = fromGlobalId(userId)
    return logTab(context.user, id, tabId, isV4)
  },
})

/**
 * Log user impact, optionally update referral impact and confirmed state
 */
const updateImpactMutation = mutationWithClientMutationId({
  name: 'UpdateImpact',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    charityId: { type: GraphQLString },
    logImpact: { type: GraphQLBoolean },
    claimPendingUserReferralImpact: { type: GraphQLBoolean },
    confirmImpact: { type: GraphQLBoolean },
    claimLatestReward: { type: GraphQLBoolean },
  },
  outputFields: {
    userImpact: {
      type: userImpactType,
      resolve: userImpact => userImpact,
    },
  },
  mutateAndGetPayload: (input, context) => {
    const userGlobalId = fromGlobalId(input.userId)
    const userImpact = updateImpact(
      context.user,
      userGlobalId.id,
      input.charityId,
      input
    )
    return userImpact
  },
})
/**
 * conditionally create invited user, send automated email
 */
const createInvitedUsersMutation = mutationWithClientMutationId({
  name: 'CreateInvitedUsers',
  inputFields: {
    inviterId: { type: new GraphQLNonNull(GraphQLString) },
    invitedEmails: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
    inviterName: { type: GraphQLString },
    inviterMessage: { type: GraphQLString },
  },
  outputFields: {
    successfulEmailAddresses: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'successfulEmailAddresses',
          fields: () => ({ email: { type: GraphQLString } }),
        })
      ),
    },
    failedEmailAddresses: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'failedEmailAddresses',
          fields: () => ({
            email: { type: GraphQLString },
            error: { type: GraphQLString },
          }),
        })
      ),
    },
  },
  mutateAndGetPayload: (input, context) => {
    const { id } = fromGlobalId(input.inviterId)
    const invitedUser = createInvitedUsers(
      context.user,
      id,
      input.invitedEmails,
      input.inviterName,
      input.inviterMessage
    )
    return invitedUser
  },
})
/**
 * conditionally create squad invite, send automated email
 */
const createSquadInvitesMutation = mutationWithClientMutationId({
  name: 'CreateSquadInvites',
  inputFields: {
    inviterId: { type: new GraphQLNonNull(GraphQLString) },
    invitedEmails: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
    inviterName: { type: new GraphQLNonNull(GraphQLString) },
    inviterMessage: { type: GraphQLString },
  },
  outputFields: {
    currentMission: {
      type: MissionType,
      description: 'the current active mission for a user',
    },
  },
  mutateAndGetPayload: (input, context) => {
    const { id } = fromGlobalId(input.inviterId)
    return createSquadInvite(
      context.user,
      id,
      input.invitedEmails,
      input.inviterName,
      input.inviterMessage
    )
  },
})

/**
 * conditionally create mission
 */
const createNewMissionMutation = mutationWithClientMutationId({
  name: 'CreateNewMission',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    squadName: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    currentMission: {
      type: MissionType,
      description: 'the current active mission for a user',
    },
  },
  mutateAndGetPayload: (input, context) => {
    const { id } = fromGlobalId(input.userId)
    return createMission(context.user, id, input.squadName)
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
    isV4: { type: GraphQLBoolean },
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
      isV4,
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
      adUnitCode,
      isV4
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
    //  TODO - remove once we update FE to not send category ID up anymore
    category: { type: GraphQLString },
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
    v4BetaEnabled: { type: GraphQLBoolean },
    missionId: { type: GraphQLString },
    causeId: { type: GraphQLString },
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
      v4BetaEnabled,
      missionId,
      causeId,
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
      extensionInstallTimeApprox,
      v4BetaEnabled,
      missionId,
      causeId
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

const setEmailMutation = mutationWithClientMutationId({
  name: 'SetEmail',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
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
  mutateAndGetPayload: ({ userId }, context) => {
    return setEmail(context.user, userId)
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
 * Enable or disable the Tab V4 beta app for this user.
 */
const setV4BetaMutation = mutationWithClientMutationId({
  name: 'SetV4Beta',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    enabled: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, enabled }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setV4Enabled(context.user, { userId: userGlobalObj.id, enabled })
  },
})

const setHasViewedIntroFlowMutation = mutationWithClientMutationId({
  name: 'SetHasViewedIntroFlow',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    enabled: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, enabled }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setHasViewedIntroFlow(context.user, {
      userId: userGlobalObj.id,
      enabled,
    })
  },
})

const deleteUserMutation = mutationWithClientMutationId({
  name: 'DeleteUser',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: ({ userId }, context) => {
    return deleteUser(context.user, userId)
  },
})

const squadInviteResponseMutation = mutationWithClientMutationId({
  name: 'SquadInviteResponse',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    missionId: { type: new GraphQLNonNull(GraphQLString) },
    accepted: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    currentMission: {
      type: MissionType,
      description: 'the current active mission for a user',
    },
  },
  mutateAndGetPayload: ({ userId, missionId, accepted }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return squadInviteResponse(
      context.user,
      userGlobalObj.id,
      missionId,
      accepted
    )
  },
})

const updateMissionNotificationMutation = mutationWithClientMutationId({
  name: 'UpdateMissionNotification',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    missionId: { type: new GraphQLNonNull(GraphQLString) },
    action: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: ({ userId, missionId, action }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return updateMissionNotification(
      context.user,
      userGlobalObj.id,
      missionId,
      action
    )
  },
})

const setHasSeenSquadsMutation = mutationWithClientMutationId({
  name: 'SetHasSeenSquads',
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
    return setHasSeenSquads(context.user, userGlobalObj.id)
  },
})
const setHasSeenCompletedMissionMutation = mutationWithClientMutationId({
  name: 'SetHasSeenCompletedMission',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    missionId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: ({ userId, missionId }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setHasSeenCompletedMission(context.user, userGlobalObj.id, missionId)
  },
})
const restartMissionMutation = mutationWithClientMutationId({
  name: 'RestartMission',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    missionId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    currentMission: {
      type: MissionType,
      description: 'the current active mission for a user',
    },
  },
  mutateAndGetPayload: ({ userId, missionId }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return restartMission(context.user, userGlobalObj.id, missionId)
  },
})
const createVideoAdLogMutation = mutationWithClientMutationId({
  name: 'CreateVideoAdLog',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    VideoAdLog: { type: videoAdLogType, resolve: log => log },
  },
  mutateAndGetPayload: async ({ userId }, context) =>
    createVideoAdLog(context.user, fromGlobalId(userId).id),
})
const logVideoAdCompleteMutation = mutationWithClientMutationId({
  name: 'LogVideoAdComplete',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    signatureArgumentString: { type: new GraphQLNonNull(GraphQLString) },
    signature: { type: new GraphQLNonNull(GraphQLString) },
    videoAdId: { type: new GraphQLNonNull(GraphQLString) },
    truexAdId: { type: new GraphQLNonNull(GraphQLString) },
    truexCreativeId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    user: {
      type: new GraphQLNonNull(userType),
      resolve: data => data.user,
    },
  },
  mutateAndGetPayload: async (input, context) =>
    logVideoAdComplete(context.user, {
      ...input,
      userId: fromGlobalId(input.userId).id,
      videoAdId: fromGlobalId(input.videoAdId).id,
    }),
})

const setUserCauseMutation = mutationWithClientMutationId({
  name: 'SetUserCause',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    causeId: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, causeId }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setUserCause(context.user, userGlobalObj.id, causeId)
  },
})

const setYahooSearchOptInMutation = mutationWithClientMutationId({
  name: 'SetYahooSearchOptIn',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    optIn: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, optIn }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setYahooSearchOptIn(context.user, userGlobalObj.id, optIn)
  },
})

const setUserSearchEngineMutation = mutationWithClientMutationId({
  name: 'SetUserSearchEngine',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    searchEngine: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ userId, searchEngine }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return setUserSearchEngine(context.user, userGlobalObj.id, searchEngine)
  },
})

const createSearchEnginePromptLogMutation = mutationWithClientMutationId({
  name: 'CreateSearchEnginePromptLog',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    searchEnginePrompted: { type: new GraphQLNonNull(GraphQLString) },
    switched: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: (
    { userId, searchEnginePrompted, switched },
    context
  ) => {
    const userGlobalObj = fromGlobalId(userId)
    return createSearchEnginePromptLog(
      context.user,
      userGlobalObj.id,
      searchEnginePrompted,
      switched
    )
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
    userImpact: {
      type: userImpactType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        charityId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args, context) => {
        const { userId, charityId } = args
        return (await UserImpactModel.getOrCreate(context.user, {
          userId,
          charityId,
        })).item
      },
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
    updateImpact: updateImpactMutation,
    createInvitedUsers: createInvitedUsersMutation,
    createSquadInvites: createSquadInvitesMutation,
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
    createNewMission: createNewMissionMutation,
    setUsername: setUsernameMutation,
    setEmail: setEmailMutation,
    updateUserExperimentGroups: updateUserExperimentGroupsMutation,
    logUserExperimentActions: logUserExperimentActionsMutation,
    setV4Beta: setV4BetaMutation,
    setHasViewedIntroFlow: setHasViewedIntroFlowMutation,
    setUserCause: setUserCauseMutation,

    deleteUser: deleteUserMutation,

    squadInviteResponse: squadInviteResponseMutation,
    updateMissionNotification: updateMissionNotificationMutation,
    setHasSeenSquads: setHasSeenSquadsMutation,
    setHasSeenCompletedMission: setHasSeenCompletedMissionMutation,
    restartMission: restartMissionMutation,
    createVideoAdLog: createVideoAdLogMutation,
    logVideoAdComplete: logVideoAdCompleteMutation,

    setYahooSearchOptIn: setYahooSearchOptInMutation,
    setUserSearchEngine: setUserSearchEngineMutation,
    createSearchEnginePromptLog: createSearchEnginePromptLogMutation,
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
