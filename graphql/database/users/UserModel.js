
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER } from '../constants'

/*
 * Represents a Charity.
 * @extends BaseModel
 */
class User extends BaseModel {
  static get name () {
    return USER
  }

  static get hashKey () {
    return 'id'
  }

  static get tableName () {
    return tableNames.users
  }

  // TODO: need defaults
  static get schema () {
    return {
      id: types.uuid(),
      username: types.string(),
      vcCurrent: types.number().integer(),
      vcAllTime: types.number().integer(),
      level: types.number().integer(),
      heartsUntilNextLevel: types.number().integer(),
      backgroundImage: types.string(),
      backgroundOption: types.string(),
      customImage: types.string(),
      activeWidget: types.string(),
      lastTabTimestamp: types.date().iso()
    }
  }

  static get permissions () {
    return {
      get: () => true,
      getAll: () => true
    }
  }
}

User.register()

export default User
