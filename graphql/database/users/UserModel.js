import moment from 'moment'

import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import {
  USER,
  USER_BACKGROUND_OPTION_DAILY,
  BACKGROUND_IMAGE_LEGACY_CATEGORY,
  BACKGROUND_IMAGE_CAT_CATEGORY,
  BACKGROUND_IMAGE_SEAS_CATEGORY,
} from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'
import config from '../../config'
import { getTodayTabCount, getTodaySearchCount } from './user-utils'
import {
  DatabaseItemDoesNotExistException,
  UserDoesNotExistException,
} from '../../utils/exceptions'

const mediaRoot = config.MEDIA_ENDPOINT

/*
 * @extends BaseModel
 */
class User extends BaseModel {
  static get name() {
    return USER
  }

  static get hashKey() {
    return 'id'
  }

  static get indexes() {
    return [
      {
        hashKey: 'username',
        name: 'UsersByUsername',
        type: 'global',
      },
      {
        hashKey: 'email',
        name: 'UsersByEmail',
        type: 'global',
      },
    ]
  }

  static get tableName() {
    return tableNames.users
  }

  static get schema() {
    const self = this
    return {
      id: types
        .string()
        .required()
        .description(
          `The unique user ID from our authentication service (Firebase)`
        ),
      email: types
        .string()
        .email()
        .allow(null)
        .description(`The email used to authenticate. If "emailVerified" is not true, this
          'value is unreliable. In addition, values are unreliable before we started  using
          'the auth token to get the email (prior to 2018 September 15). Our authentication
          'service (Firebase) is the source of truth for emails.`),
      username: types
        .string()
        .description(
          `Username provided by the user. Will be unique (caps-sensitive).`
        ),
      name: types
        .string()
        .description(
          `an optional field currently added when a user invites someone new via email invite`
        ),
      truexId: types
        .string()
        .required()
        .description(
          `The unique user truex Id passed to truex integration when we show video ads`
        ),
      joined: types
        .string()
        .isoDate()
        .required()
        .description(`The datetime the user first started using the app. This may differ
          from "created", which is literally when the database item was created.`),
      justCreated: types.boolean().forbidden() // only set in app code
        .description(`In a getOrCreate operation, whether the user was created in that
          operation.`),
      vcCurrent: types
        .number()
        .integer()
        .default(self.fieldDefaults.vcCurrent)
        .description(`The number of Hearts the user possesses.`),
      vcAllTime: types
        .number()
        .integer()
        .default(self.fieldDefaults.vcAllTime)
        .description(`The number of Hearts the user has earned all time, including both
          Hearts from opening tabs and from recruiting friends.`),
      level: types
        .number()
        .integer()
        .default(self.fieldDefaults.level)
        .description(
          `The current level the user is on, relying on the UserLevel model.`
        ),
      tabs: types
        .number()
        .integer()
        .default(self.fieldDefaults.tabs)
        .description(`The total number of tabs the user has opened since joining. There
          may be a delay in logging the tab on the client side, so it will likely slightly
          undercount.`),
      tabsToday: types
        .number()
        .integer()
        .forbidden() // only set in deserializer
        .description(`How many tabs the user has opened today (UTC day).`),
      v4BetaEnabled: types
        .boolean()
        .default(self.fieldDefaults.v4BetaEnabled)
        .description(`If true, serve the new Tab V4 app.`),
      hasViewedIntroFlow: types
        .boolean()
        .default(self.fieldDefaults.hasViewedIntroFlow)
        .description(
          `A flag indicating whether a user has viewed the intro in tab v4`
        ),
      deleted: types
        .boolean()
        .default(self.fieldDefaults.deleted)
        .description(
          `A flag indicating whether or not this User has been deleted.`
        ),
      validTabs: types
        .number()
        .integer()
        .default(self.fieldDefaults.tabs)
        .description(`The total number of tabs the user has opened since joining, filtering
          tabs that we consider "fraudulent", such as tabs opened in quick succession and
          too many tabs in a day.`),
      maxTabsDay: types
        .object({
          // The count of tabs for the day on which the user opened
          // the most tabs.
          maxDay: types.object({
            date: types.string().isoDate(),
            numTabs: types.number().integer(),
          }),
          // The count of tabs for the current (or most recent) day
          // the user has opened a tab.
          recentDay: types.object({
            date: types.string().isoDate(),
            numTabs: types.number().integer(),
          }),
        })
        .default(
          self.fieldDefaults.maxTabsDay,
          `Default is zero tabs for today.`
        )
        .description(
          `A tracker of the day with the largest number of tabs opened.`
        ),
      heartsUntilNextLevel: types
        .number()
        .integer()
        .default(self.fieldDefaults.heartsUntilNextLevel)
        .description(`A countdown of Hearts until the user advances to the next level.
          This relies on the Heart requirements from the UserLevel model.`),
      vcDonatedAllTime: types
        .number()
        .integer()
        .default(self.fieldDefaults.vcDonatedAllTime)
        .description(`The total number of Hearts the user has donated to charities since
          joining.`),
      numUsersRecruited: types
        .number()
        .integer()
        .default(self.fieldDefaults.numUsersRecruited)
        .description(`The number of new users joined from this user's referral link. This
          number may differ from the number of ReferralDataLog items that exist with this
          user as the referring user. For example, we log referrals immediately but may
          reward the referring user only after the referred user signs in and verifies
          their email address.`),
      backgroundImage: types
        .object({
          id: types.string().required(),
          image: types.string().required(),
          thumbnail: types.string(),
          category: types
            .string()
            .valid([
              BACKGROUND_IMAGE_LEGACY_CATEGORY,
              BACKGROUND_IMAGE_CAT_CATEGORY,
              BACKGROUND_IMAGE_SEAS_CATEGORY,
            ]),
          imageURL: types.string().forbidden(), // only set in deserializer
          thumbnailURL: types.string().forbidden(), // only set in deserializer
          timestamp: types
            .string()
            .isoDate()
            .description(`The datetime this photo was last selected/changed.`),
        })
        .default(
          self.fieldDefaults.backgroundImage,
          `Default background image.`
        )
        .description(`The user's new tab page background photo.`),
      backgroundOption: types
        .string()
        .default(self.fieldDefaults.backgroundOption)
        .description(
          `The type of new tab page background the user has selected.`
        ),
      backgroundColor: types
        .string()
        .description(`The user's new tab page background color hex.`),
      customImage: types.string()
        .description(`A URL of the custom photo the user has as their new tab
          background.`),
      activeWidget: types.string()
        .description(`The ID of the widget the user has visible on the new tab page.
          Note: due to a bug, the ID is actually the Relay global ID.`),
      lastTabTimestamp: types
        .string()
        .isoDate()
        .description(`The datetime of the last time the user opened a tab`),
      mergedIntoExistingUser: types.boolean()
        .description(`This is true if this user was anonymous but then later signed
          in as another existing user. This value is assigned on the client so is not
          trustworthy`),
      emailVerified: types.boolean()
        .description(`Whether the user has verified their email with our auth service
          (Firebase). Our system of logging email verification here is flaky, so a
          false or undefined value does not necessarily mean the user's email is
          unverified. Firebase is the source of truth for this value.`),
      referrerRewarded: types.boolean()
        .description(`This is true if the user was referred by another user and we
          have credited the referring user for the recruit.`),
      extensionInstallId: types.string().uuid()
        .description(`The unique ID we create when the user installs the extension.
          This value is assigned on the client so is not trustworthy.`),
      extensionInstallTimeApprox: types.string().isoDate()
        .description(`The approximate datetime the user installed the extension.
          This value is assigned on the client so is not trustworthy.`),
      // Search for a Cause
      searches: types
        .number()
        .integer()
        .default(self.fieldDefaults.searches)
        .description(
          `The total number of searches the user has made since joining.`
        ),
      searchesToday: types
        .number()
        .integer()
        .forbidden() // only set in deserializer
        .description(`How many searches the user has made today (UTC day).`),
      maxSearchesDay: types
        .object({
          // The count of searches for the day on which the user
          // searched the most number of times.
          maxDay: types.object({
            date: types.string().isoDate(),
            numSearches: types.number().integer(),
          }),
          // The count of searches for the current (or most recent) day
          // the user has searched.
          recentDay: types.object({
            date: types.string().isoDate(),
            numSearches: types.number().integer(),
          }),
        })
        .default(
          self.fieldDefaults.maxSearchesDay,
          `Default is zero searches for today.`
        )
        .description(
          `A tracker of the day with the largest number of searches.`
        ),
      lastSearchTimestamp: types
        .string()
        .isoDate()
        .description(`The datetime of the last time the user searched.`),
      // Group assignments for experiments / split-tests
      testGroupAnonSignIn: types
        .number()
        .integer()
        .allow(null)
        .description(`Which group the user is in for the "anonymous user sign-in"
          split-test. This value is assigned on the client so is not trustworthy.`),
      testGroupVariousAdSizes: types
        .number()
        .integer()
        .allow(null)
        .description(`Which group the user is in for the "various ad sizes"
          split-test. This value is assigned on the client so is not trustworthy.`),
      testGroupThirdAd: types
        .number()
        .integer()
        .allow(null)
        .description(`Which group the user is in for the "three ads" split-test. 
          This value is assigned on the client so is not trustworthy.`),
      testGroupThirdAdJoinTime: types
        .string()
        .isoDate()
        .description(
          `The datetime of when the user was assigned their experiment group.`
        ),
      testOneAdForNewUsers: types
        .number()
        .integer()
        .allow(null)
        .description(`Which group the user is in for the "one ad for new users"
          split-test. This value is assigned on the client so is not trustworthy.`),
      testAdExplanation: types
        .number()
        .integer()
        .allow(null)
        .description(`Which group the user is in for the "ad explanation" split-test.
          This value is assigned on the client so is not trustworthy.`),
      testGroupSearchIntro: types
        .number()
        .integer()
        .allow(null)
        .description(`Which group the user is in for the "search intro" split-test.
          This value is assigned on the client so is not trustworthy.`),
      testGroupSearchIntroJoinedTime: types.string().isoDate()
        .description(`The time the user was assigned a group for the "search intro"
          split-test.`),
      testSearchIntroAction: types
        .number()
        .integer()
        .allow(null)
        .description(
          `Any action the user took for the "search intro" split-test.
           0 = no action, 1 = dismissed, 2 = clicked to try Search for a Cause.
          `
        ),
      testSearchIntroActionTime: types.string().isoDate()
        .description(`The time the user made the action (testSearchIntroAction)
          for the "search intro" split-test.`),
      testGroupReferralNotification: types
        .number()
        .integer()
        .allow(null)
        .description(`Which group the user is in for the "referral notification" split-test.
          This value is assigned on the client so is not trustworthy.`),
      testGroupReferralNotificationJoinedTime: types.string().isoDate()
        .description(`The time the user was assigned a group for the "referral notification"
          split-test.`),
      testReferralNotificationAction: types
        .number()
        .integer()
        .allow(null)
        .description(
          `Any action the user took for the "referral notification" split-test.
           0 = no action, 1 = dismissed, 2 = clicked to the "invite friend" page.
          `
        ),
      testReferralNotificationActionTime: types.string().isoDate()
        .description(`The time the user took an action for the "referral notification"
          split-test.`),
      currentMissionId: types
        .string()
        .length(9)
        .description('the current mission id'),
      pendingMissionInvites: types
        .array()
        .items(
          types.object({
            missionId: types
              .string()
              .description('the mission id of squad invite'),
            invitingUser: types.object({
              userId: types.string().description('inviting user user id'),
              name: types.string().description('the name entered in invite'),
            }),
          })
        )
        .default(self.fieldDefaults.pendingMissionInvites),
      hasSeenSquads: types
        .boolean()
        .description('if a user has been introduced to squads')
        .default(self.fieldDefaults.hasSeenSquads),
      causeId: types
        .string()
        .description('id for cause user belongs to')
        .default(self.fieldDefaults.causeId),
    }
  }

  static get fieldDefaults() {
    return {
      vcCurrent: 0,
      vcAllTime: 0,
      level: 0,
      tabs: 0,
      validTabs: 0,
      maxTabsDay: () => ({
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 0,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 0,
        },
      }),
      // On the first Heart gained, immediately level up to Level 1.
      heartsUntilNextLevel: 0,
      vcDonatedAllTime: 0,
      numUsersRecruited: 0,
      backgroundImage: () => ({
        id: '7e73d6d7-b915-4366-b01a-ffc126466d5b',
        image: '3acd54614b1d4d7fbce85d965de3de25.jpg',
        thumbnail: '71a27d6823244354acb85e0806d0dff1.jpg',
        timestamp: moment.utc().toISOString(),
        category: BACKGROUND_IMAGE_LEGACY_CATEGORY,
      }),
      backgroundOption: USER_BACKGROUND_OPTION_DAILY,
      searches: 0,
      maxSearchesDay: () => ({
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 0,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 0,
        },
      }),
      v4BetaEnabled: false,
      hasViewedIntroFlow: false,
      deleted: false,
      pendingMissionInvites: [],
      hasSeenSquads: false,
      // cats cause ID for default.
      causeId: 'CA6A5C2uj',
    }
  }

  static get fieldDeserializers() {
    return {
      tabsToday: (tabsToday, userObj) =>
        // Calculate tabsToday based on the maxTabsDay value
        getTodayTabCount(userObj),
      searchesToday: (tabsToday, userObj) =>
        // Calculate searchesToday based on the maxSearchesDay value
        getTodaySearchCount(userObj),
      backgroundImage: backgroundImage =>
        Object.assign({}, backgroundImage, {
          imageURL: `${mediaRoot}/img/backgrounds/${backgroundImage.image}`,
          thumbnailURL: `${mediaRoot}/img/background-thumbnails/${
            backgroundImage.thumbnail
          }`,
        }),
    }
  }

  // Extend the `get` method to throw a unique error when
  // an item does not exist.
  static async get(...args) {
    try {
      const response = await super.get(...args)
      return response
    } catch (e) {
      if (e.code === DatabaseItemDoesNotExistException.code) {
        throw new UserDoesNotExistException()
      } else {
        throw e
      }
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      getAll: () => false,
      update: permissionAuthorizers.userIdMatchesHashKey,
      // To create a new user, the created item must have the same
      // email and user ID as the authorized user.
      create: (userContext, hashKey, rangeKey, item) => {
        if (!userContext || !item) {
          return false
        }
        return (
          userContext.id === item.id &&
          // If an email address exists in the user's token or
          // in the item to create, only authorize an item creation
          // if the emails match. However, allow null values for
          // the email (for anonymous users).
          (item.email || userContext.email
            ? userContext.email === item.email
            : true)
        )
      },
      indexPermissions: {
        // The userContext does not include the user's username, so
        // there's no clean way to verify item ownership based on username
        // lookup prior to making the query. For now, require a permissions
        // override to access this secondary index.
        UsersByUsername: {
          get: () => false,
          getAll: () => false,
          update: () => false,
          create: () => false,
        },
      },
    }
  }
}

User.register()

export default User
