
import moment from 'moment'

import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import {
  USER,
  USER_BACKGROUND_OPTION_PHOTO
} from '../constants'
import {
  permissionAuthorizers
} from '../../utils/authorization-helpers'
import config from '../../config'
import { getTodayTabCount } from './user-utils'

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
      id: types.string().required(),
      email: types.string().email().required(),
      username: types.string(),
      joined: types.string().isoDate().required(),
      justCreated: types.boolean().forbidden(), // only set in app code
      vcCurrent: types.number().integer().default(self.fieldDefaults.vcCurrent),
      vcAllTime: types.number().integer().default(self.fieldDefaults.vcAllTime),
      level: types.number().integer().default(self.fieldDefaults.level),
      tabs: types.number().integer().default(self.fieldDefaults.tabs),
      tabsToday: types.number().integer().forbidden(), // only set in deserializer
      validTabs: types.number().integer().default(self.fieldDefaults.tabs),
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
        .default(self.fieldDefaults.maxTabsDay,
          'Used to track the most tabs opened in a day'),
      heartsUntilNextLevel: types.number().integer()
        .default(self.fieldDefaults.heartsUntilNextLevel),
      vcDonatedAllTime: types.number().integer()
        .default(self.fieldDefaults.vcDonatedAllTime),
      numUsersRecruited: types.number().integer()
        .default(self.fieldDefaults.numUsersRecruited),
      backgroundImage: types.object(
        {
          id: types.string().required(),
          image: types.string().required(),
          thumbnail: types.string().required(),
          imageURL: types.string().forbidden(), // only set in deserializer
          thumbnailURL: types.string().forbidden(), // only set in deserializer
          timestamp: types.string().isoDate()
        })
        .default(self.fieldDefaults.backgroundImage, 'Default background image.'),
      backgroundOption: types.string().default(self.fieldDefaults.backgroundOption),
      backgroundColor: types.string(),
      customImage: types.string(),
      activeWidget: types.string(),
      lastTabTimestamp: types.string().isoDate()
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
      backgroundOption: USER_BACKGROUND_OPTION_PHOTO
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
          userContext.email === item.email
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
