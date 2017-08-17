
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
      vcCurrent: types.number().integer().default(self.fieldDefaults.vcCurrent),
      vcAllTime: types.number().integer().default(self.fieldDefaults.vcAllTime),
      level: types.number().integer().default(self.fieldDefaults.level),
      heartsUntilNextLevel: types.number().integer()
        .default(self.fieldDefaults.heartsUntilNextLevel),
      backgroundImage: types.object().default(self.fieldDefaults.backgroundImage),
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
      // On the first Heart gained, immediately level up to Level 1.
      heartsUntilNextLevel: 0,
      backgroundImage: {
        id: '49fcb132-9b6b-431b-bda8-50455e215be7',
        name: 'Into the Blue',
        image: '661651039af4454abb852927b3a5b8f9.jpg',
        thumbnail: '4c44e725d97e4a5fb4fb6e95ee7d05cb.jpg',
        timestamp: moment.utc().toISOString
      },
      backgroundOption: USER_BACKGROUND_OPTION_PHOTO
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
