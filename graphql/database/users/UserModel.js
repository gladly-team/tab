
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
      heartsUntilNextLevel: types.number().integer(),
      backgroundImage: types.object().default(self.fieldDefaults.backgroundImage),
      backgroundOption: types.string().default(self.fieldDefaults.backgroundOption),
      backgroundColor: types.string(),
      customImage: types.string(),
      activeWidget: types.string(),
      lastTabTimestamp: types.date().iso()
    }
  }

  static get fieldDefaults () {
    return {
      vcCurrent: 0,
      vcAllTime: 0,
      level: 1,
      // This value needs to match the hearts required for level 2
      // in the database.
      heartsUntilNextLevel: 5,
      backgroundImage: {
        id: 'fb5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Mountain Lake',
        fileName: 'lake.jpg',
        timestamp: moment.utc().format()
      },
      backgroundOption: USER_BACKGROUND_OPTION_PHOTO
    }
  }

  static get permissions () {
    return {
      get: permissionAuthorizers.usernameOrUserIdMatchesHashKey,
      getAll: () => false,
      update: permissionAuthorizers.usernameOrUserIdMatchesHashKey,
      // To create a new user, the created item must have the same
      // email, username, and user ID as the authorized user.
      create: (userContext, hashKey, rangeKey, item) => {
        return (
          userContext.id === item.id &&
          userContext.email === item.email &&
          userContext.username === item.username
        )
      }
    }
  }
}

User.register()

export default User
