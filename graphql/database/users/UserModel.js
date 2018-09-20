
import moment from 'moment'

import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import {
  USER,
  USER_BACKGROUND_OPTION_DAILY
} from '../constants'
import {
  permissionAuthorizers
} from '../../utils/authorization-helpers'
import config from '../../config'
import { getTodayTabCount } from './user-utils'
import {
  DATABASE_ITEM_DOES_NOT_EXIST,
  UserDoesNotExistException
} from '../../utils/exceptions'

const mediaRoot = config.MEDIA_ENDPOINT

/*
 * @extends BaseModel
 */
class User extends BaseModel {
  static get name () {
    return USER
  }

  static get hashKey () {
    return 'id'
  }

  static get indexes () {
    return [{
      hashKey: 'username',
      name: 'UsersByUsername',
      type: 'global'
    }]
  }

  static get tableName () {
    return tableNames.users
  }

  static get schema () {
    const self = this
    return {
      id: types.string().required()
        .description(`The unique user ID from our authentication service (Firebase)`),
      email: types.string().email().allow(null)
        .description(`The email used to authenticate. If "emailVerified" is not true, this
          'value is unreliable. In addition, values are unreliable before we started  using
          'the auth token to get the email (prior to 2018 September 15). Our authentication
          'service (Firebase) is the source of truth for emails.`),
      username: types.string()
        .description(`Username provided by the user. Will be unique (caps-sensitive).`),
      joined: types.string().isoDate().required()
        .description(`The datetime the user first started using the app. This may differ
          from "created", which is literally when the database item was created.`),
      justCreated: types.boolean()
        .forbidden() // only set in app code
        .description(`In a getOrCreate operation, whether the user was created in that
          operation.`),
      vcCurrent: types.number().integer()
        .default(self.fieldDefaults.vcCurrent)
        .description(`The number of Hearts the user possesses.`),
      vcAllTime: types.number().integer()
        .default(self.fieldDefaults.vcAllTime)
        .description(`The number of Hearts the user has earned all time, including both
          Hearts from opening tabs and from recruiting friends.`),
      level: types.number().integer()
        .default(self.fieldDefaults.level)
        .description(`The current level the user is on, relying on the UserLevel model.`),
      tabs: types.number().integer()
        .default(self.fieldDefaults.tabs)
        .description(`The total number of tabs the user has opened since joining. There
          may be a delay in logging the tab on the client side, so it will likely slightly
          undercount.`),
      tabsToday: types.number().integer()
        .forbidden() // only set in deserializer
        .description(`How many tabs the user has opened today (UTC day).`),
      validTabs: types.number().integer()
        .default(self.fieldDefaults.tabs)
        .description(`The total number of tabs the user has opened since joining, filtering
          tabs that we consider "fraudulent", such as tabs opened in quick succession and
          too many tabs in a day.`),
      maxTabsDay: types.object({
        // The count of tabs for the day on which the user opened
        // the most tabs.
        maxDay: types.object({
          date: types.string().isoDate(),
          numTabs: types.number().integer()
        }),
        // The count of tabs for the current (or most recent) day
        // the user has opened a tab.
        recentDay: types.object({
          date: types.string().isoDate(),
          numTabs: types.number().integer()
        })
      })
        .default(self.fieldDefaults.maxTabsDay, `Default is zero tabs for today.`)
        .description(`A tracker of the day with the largest number of tabs opened.`),
      heartsUntilNextLevel: types.number().integer()
        .default(self.fieldDefaults.heartsUntilNextLevel)
        .description(`A countdown of Hearts until the user advances to the next level.
          This relies on the Heart requirements from the UserLevel model.`),
      vcDonatedAllTime: types.number().integer()
        .default(self.fieldDefaults.vcDonatedAllTime)
        .description(`The total number of Hearts the user has donated to charities since
          joining.`),
      numUsersRecruited: types.number().integer()
        .default(self.fieldDefaults.numUsersRecruited)
        .description(`The number of new users joined from this user's referral link. This
          number may differ from the number of ReferralDataLog items that exist with this
          user as the referring user. For example, we log referrals immediately but may
          reward the referring user only after the referred user signs in and verifies
          their email address.`),
      backgroundImage: types.object(
        {
          id: types.string().required(),
          image: types.string().required(),
          thumbnail: types.string().required(),
          imageURL: types.string().forbidden(), // only set in deserializer
          thumbnailURL: types.string().forbidden(), // only set in deserializer
          timestamp: types.string().isoDate()
            .description(`The datetime this photo was last selected/changed.`)
        })
        .default(self.fieldDefaults.backgroundImage, `Default background image.`)
        .description(`The user's new tab page background photo.`),
      backgroundOption: types.string()
        .default(self.fieldDefaults.backgroundOption)
        .description(`The type of new tab page background the user has selected.`),
      backgroundColor: types.string()
        .description(`The user's new tab page background color hex.`),
      customImage: types.string()
        .description(`A URL of the custom photo the user has as their new tab
          background.`),
      activeWidget: types.string()
        .description(`The ID of the widget the user has visible on the new tab page.
          Note: due to a bug, the ID is actually the Relay global ID.`),
      lastTabTimestamp: types.string().isoDate()
        .description(`The datetime of the last time the user opened a tab`),
      mergedIntoExistingUser: types.boolean()
        .description(`This is true if this user was anonymous but then later signed
          in as another existing user.This value is assigned on the client so is not
          trustworthy`),
      emailVerified: types.boolean()
        .description(`Whether the user has verified their email with our auth service
          (Firebase). Our system of logging email verification here is flaky, so a
          false or undefined value does not necessarily mean the user's email is
          unverified. Firebase is the source of truth for this value.`),
      referrerRewarded: types.boolean()
        .description(`This is true if the user was referred by another user and we
          have credited the referring user for the recruit.`),
      // Group assignments for experiments / split-tests
      testGroupAnonSignIn: types.number().integer().allow(null)
        .description(`Which group the user is in for the "anonymous user sign-in"
          split-test. This value is assigned on the client so is not trustworthy.`)
    }
  }

  static get fieldDefaults () {
    return {
      vcCurrent: 0,
      vcAllTime: 0,
      level: 0,
      tabs: 0,
      validTabs: 0,
      maxTabsDay: () => ({
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 0
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 0
        }
      }),
      // On the first Heart gained, immediately level up to Level 1.
      heartsUntilNextLevel: 0,
      vcDonatedAllTime: 0,
      numUsersRecruited: 0,
      backgroundImage: () => ({
        id: '9308b921-44c7-4b4e-845d-3b01fa73fa2b',
        image: '94bbd29b17fe4fa3b45777281a392f21.jpg',
        thumbnail: '5d4dfd0b34134879903f0480720bd746.jpg',
        timestamp: moment.utc().toISOString()
      }),
      backgroundOption: USER_BACKGROUND_OPTION_DAILY
    }
  }

  static get fieldDeserializers () {
    return {
      tabsToday: (tabsToday, userObj) => {
        // Calculate tabsToday based on the maxTabsDay value
        return getTodayTabCount(userObj)
      },
      backgroundImage: (backgroundImage, userObj) => {
        return Object.assign({}, backgroundImage, {
          imageURL: `${mediaRoot}/img/backgrounds/${backgroundImage.image}`,
          thumbnailURL: `${mediaRoot}/img/background-thumbnails/${backgroundImage.thumbnail}`
        })
      }
    }
  }

  // Extend the `get` method to throw a unique error when
  // an item does not exist.
  static async get (...args) {
    try {
      const response = await super.get(...args)
      return response
    } catch (e) {
      if (e.code === DATABASE_ITEM_DOES_NOT_EXIST) {
        throw new UserDoesNotExistException()
      } else {
        throw e
      }
    }
  }

  static get permissions () {
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
          ((item.email || userContext.email) ? userContext.email === item.email : true)
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
          create: () => false
        }
      }
    }
  }
}

User.register()

export default User
