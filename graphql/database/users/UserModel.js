
import moment from 'moment'
import { has } from 'lodash/object'

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
      id: types.uuid(),
      email: types.string().email().required(),
      username: types.string().required(),
      joined: types.string().isoDate().required(),
      vcCurrent: types.number().integer().default(self.fieldDefaults.vcCurrent),
      vcAllTime: types.number().integer().default(self.fieldDefaults.vcAllTime),
      level: types.number().integer().default(self.fieldDefaults.level),
      tabs: types.number().integer().default(self.fieldDefaults.tabs),
      validTabs: types.number().integer().default(self.fieldDefaults.tabs),
      heartsUntilNextLevel: types.number().integer()
        .default(self.fieldDefaults.heartsUntilNextLevel),
      vcDonatedAllTime: types.number().integer().default(self.fieldDefaults.vcDonatedAllTime),
      numUsersRecruited: types.number().integer().default(self.fieldDefaults.numUsersRecruited),
      backgroundImage: types.object(
        {
          id: types.uuid(),
          image: types.string(),
          imageURL: types.string().forbidden(), // only set in deserializer
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
      // On the first Heart gained, immediately level up to Level 1.
      heartsUntilNextLevel: 0,
      vcDonatedAllTime: 0,
      numUsersRecruited: 0,
      backgroundImage: () => ({
        id: '49fcb132-9b6b-431b-bda8-50455e215be7',
        image: '661651039af4454abb852927b3a5b8f9.jpg',
        timestamp: moment.utc().toISOString()
      }),
      backgroundOption: USER_BACKGROUND_OPTION_PHOTO
    }
  }

  static get fieldDeserializers () {
    return {
      backgroundImage: (backgroundImage, userObj) => {
        const finalObj = (
          has(backgroundImage, 'image')
          ? Object.assign({}, backgroundImage, {
            imageURL: `${mediaRoot}/img/backgrounds/${backgroundImage.image}`
          })
          : null
        )
        return finalObj
      }
    }
  }

  static get permissions () {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      getAll: () => false,
      update: permissionAuthorizers.userIdMatchesHashKey,
      // To create a new user, the created item must have the same
      // email, username, and user ID as the authorized user.
      create: (userContext, hashKey, rangeKey, item) => {
        if (!userContext || !item) {
          return false
        }
        return (
          userContext.id === item.id &&
          userContext.email === item.email &&
          userContext.username === item.username
        )
      },
      indexPermissions: {
        // Separate permissions for secondary index.
        UsersByUsername: {
          get: permissionAuthorizers.usernameMatchesHashKey
        }
      }
    }
  }
}

User.register()

export default User
