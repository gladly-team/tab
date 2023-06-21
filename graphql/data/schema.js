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
  connectionFromArray,
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
  SEARCH_ENGINE,
  SEARCH_ENGINE_PERSONALIZED,
  FEATURE,
  CAUSE_IMPACT_TYPES,
  IMPACT_METRIC,
  GROUP_IMPACT_METRIC,
  USER_GROUP_IMPACT_METRIC,
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
import createSfacExtensionPromptResponse from '../database/users/createSfacExtensionPromptResponse'

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
import createUserExperiment from '../database/experiments/createUserExperiment'
import {
  getLongestTabStreak,
  getCurrentTabStreak,
  getMaxTabsDay,
  getMissionCurrentTabsDay,
} from '../database/missions/utils'
import createMission from '../database/missions/createMission'
import searchEngines from '../database/search/searchEngines'
import UserExperimentModel from '../database/experiments/UserExperimentModel'
import getSearchEngine from '../database/search/getSearchEngine'
import SearchEngineModel from '../database/search/SearchEngineModel'
import getUserFeatures from '../database/experiments/getUserFeatures'
import getGroupImpactMetricForCause from '../database/groupImpact/getGroupImpactMetricForCause'
import getCauseImpactMetricCount from '../database/groupImpact/getCauseImpactMetricCount'
import GroupImpactMetricModel from '../database/groupImpact/GroupImpactMetricModel'
import ImpactMetricModel from '../database/groupImpact/ImpactMetricModel'
import UserGroupImpactMetricModel from '../database/groupImpact/UserGroupImpactMetricModel'

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
import getUserSearchEngine from '../database/users/getUserSearchEngine'
import getShouldShowYahooPrompt from '../database/users/getShouldShowYahooPrompt'
import getShouldShowSfacExtensionPrompt from '../database/users/getShouldShowSfacExtensionPrompt'
import getUserNotifications from '../database/users/getUserNotifications'
import getSfacActivityState from '../database/users/getSfacActivityState'
import getShouldShowSfacIcon from '../database/users/getShouldShowSfacIcon'
import getLandingPagePhrase from '../database/users/getLandingPagePhrase'
import {
  getImpactMetricById,
  getImpactMetricsByCharityId,
} from '../database/groupImpact/impactMetricRepository'

import getCauseForWildfire from '../database/cause/getCauseForWildfire'
import getCharitiesForCause from '../database/charities/getCharityForCause'
import GroupImpactLeaderboard from '../database/groupImpact/GroupImpactLeaderboard'

// Types
import wildfireType from './types/wildfire'
import mutationType from './types/mutationType';
import queryType from './types/queryType';
import EncodedRevenueValueType from './types/EncodedRevenueValueType';
import customErrorType from './types/customErrorType';
import MissionType from './types/MissionType';
import appType from './types/appType';
import campaignType from './types/campaignType';
import campaignThemeType from './types/campaignThemeType';
import campaignSocialSharingType from './types/campaignSocialSharingType';
import campaignGoalType from './types/campaignGoalType';
import campaignTimeType from './types/campaignTimeType';
import campaignContentType from './types/campaignContentType';
import invitedUsersType from './types/invitedUsersType';
import userImpactType from './types/userImpactType';
import charityType from './types/charityType';
import videoAdLogType from './types/videoAdLogType';
import widgetType from './types/widgetType';
import userRecruitType from './types/userRecruitType';
import SearchEnginePersonalizedType from './types/SearchEnginePersonalizedType';
import SearchEngineType from './types/SearchEngineType';
import CauseType from './types/CauseType';
import userGroupImpactMetricType from './types/userGroupImpactMetricType';
import groupImpactMetricType from './types/groupImpactMetricType';
import impactMetricType from './types/impactMetricType';
import CauseOnboardingCopyType from './types/CauseOnboardingCopyType';
import CauseSharingCopyType from './types/CauseSharingCopyType';
import CauseThemeType from './types/CauseThemeType';
import featureType from './types/featureType';
import userType from './types/userType';
import ExperimentActionsOutputType from './types/ExperimentActionsOutputType';
import ExperimentActionsType from './types/ExperimentActionsType';
import ExperimentGroupsType from './types/ExperimentGroupsType';
import searchRateLimitType from './types/searchRateLimitType';
import maxSearchesDayType from './types/maxSearchesDayType';
import maxTabsDayType from './types/maxTabsDayType';
import backgroundImageType from './types/backgroundImageType';

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
    if (type === SEARCH_ENGINE) {
      return getSearchEngine(id)
    }
    if (type === GROUP_IMPACT_METRIC) {
      return GroupImpactMetricModel.get(context.user, id)
    }
    if (type === IMPACT_METRIC) {
      return getImpactMetricById(id)
    }
    if (type === USER_GROUP_IMPACT_METRIC) {
      return UserGroupImpactMetricModel.get(context.user, id)
    }
    return null
  },
  (obj) => {
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
    if (obj instanceof SearchEngineModel) {
      return SearchEngineType
    }
    if (obj instanceof GroupImpactMetricModel) {
      return groupImpactMetricType
    }
    if (obj instanceof ImpactMetricModel) {
      return impactMetricType
    }
    return null
  }
)

/**
 * Define your own types here
 */











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





// TODO: fetch only the fields we need:
// https://github.com/graphql/graphql-js/issues/19#issuecomment-272857189
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













const searchEngineSharedFields = {
  engineId: {
    type: new GraphQLNonNull(GraphQLString),
    description: "Engine's id",
    resolve: (engine) => engine.id,
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
    description: `Name of the Search Engine`,
  },
  rank: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'what order to display the search engine in a list',
  },
  isCharitable: {
    type: new GraphQLNonNull(GraphQLBoolean),
    description: `Whether or not the user can earn extra impact with this Search Engine`,
  },
  inputPrompt: {
    type: new GraphQLNonNull(GraphQLString),
    description: `Display string to display in the search bar`,
  },
}




















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
      resolve: (squadMember) => getLongestTabStreak(squadMember),
    },
    currentTabStreak: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the current tab streak in days so far',
      resolve: (squadMember) => getCurrentTabStreak(squadMember),
    },

    missionMaxTabsDay: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the most tabs in a single day',
      resolve: (squadMember) => getMaxTabsDay(squadMember),
    },
    missionCurrentTabsDay: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the current tabs today',
      resolve: (squadMember) => getMissionCurrentTabsDay(squadMember),
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
const { connectionType: searchEngineConnection } = connectionDefinitions({
  name: SEARCH_ENGINE,
  nodeType: SearchEngineType,
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
      resolve: (connection) => getTotalRecruitsCount(connection.edges),
    },
    recruitsActiveForAtLeastOneDay: {
      type: GraphQLInt,
      description:
        'The count of users recruited who remained active for one day or more',
      resolve: (connection) =>
        getRecruitsActiveForAtLeastOneDay(connection.edges),
    },
    recruitsWithAtLeastOneTab: {
      type: GraphQLInt,
      description:
        'The count of users recruited who have opened one tab or more',
      resolve: (connection) => getRecruitsWithAtLeastOneTab(connection.edges),
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
      resolve: (user) => user,
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
      resolve: (userImpact) => userImpact,
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
    invitedEmails: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
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
    invitedEmails: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
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
    userIdGlobal: {
      type: GraphQLString,
      description:
        'The user Relay global ID. Provide either this or `userId` for an existing user.',
    },
    userId: {
      type: GraphQLString,
      description:
        'The actual user ID (not the Relay global). Provide either this or `userIdGlobal` for an existing user.',
    },
    anonUserId: {
      type: GraphQLString,
      description: 'The anonymous user ID. Provide this for an anonymous user.',
    },
    source: { type: GraphQLString },
    causeId: { type: GraphQLString },
    searchEngineId: { type: GraphQLString },
    version: { type: GraphQLInt },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (user) => user.user,
    },
    success: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: (
    { userId, userIdGlobal, anonUserId, ...additionalData },
    context
  ) => {
    const userGlobalObj = userIdGlobal ? fromGlobalId(userIdGlobal) : {}
    return logSearch(
      context.user,
      userId || userGlobalObj.id,
      anonUserId,
      additionalData
    )
  },
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
          'The operation to use to resolve multiple values into a final revenue value. We currently only support "MAX".',
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
      resolve: (data) => data.user,
    },
    errors: {
      type: new GraphQLList(customErrorType),
      resolve: (data) => data.errors,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
      resolve: (userWidget) => userWidget,
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
      resolve: (userWidget) => userWidget,
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
      resolve: (userWidget) => userWidget,
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
      resolve: (userWidget) => userWidget,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
      resolve: (data) => data.user,
    },
    errors: {
      type: new GraphQLList(customErrorType),
      resolve: (data) => data.errors,
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
      resolve: (data) => data.user,
    },
    errors: {
      type: new GraphQLList(customErrorType),
      resolve: (data) => data.errors,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
    VideoAdLog: { type: videoAdLogType, resolve: (log) => log },
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
      resolve: (data) => data.user,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
      resolve: (user) => user,
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
    user: {
      type: userType,
      resolve: (user) => user,
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

const createSfacExtensionPromptResponseMutation = mutationWithClientMutationId({
  name: 'CreateSfacExtensionPromptResponse',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    browser: { type: new GraphQLNonNull(GraphQLString) },
    accepted: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (user) => user,
    },
  },
  mutateAndGetPayload: ({ userId, browser, accepted }, context) => {
    const userGlobalObj = fromGlobalId(userId)
    return createSfacExtensionPromptResponse(
      context.user,
      userGlobalObj.id,
      browser,
      accepted
    )
  },
})

const createUserExperimentMutation = mutationWithClientMutationId({
  name: 'CreateUserExperiment',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    experimentId: { type: new GraphQLNonNull(GraphQLString) },
    variationId: { type: new GraphQLNonNull(GraphQLInt) },
    variationValueStr: { type: GraphQLString },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: async (
    { userId, experimentId, variationId, variationValueStr },
    context
  ) => {
    const userGlobalObj = fromGlobalId(userId)
    return createUserExperiment(context.user, userGlobalObj.id, {
      experimentId,
      variationId,
      variationValueStr,
    })
  },
})

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */


/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */


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
    createSfacExtensionPromptResponse:
      createSfacExtensionPromptResponseMutation,

    createUserExperiment: createUserExperimentMutation,
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
