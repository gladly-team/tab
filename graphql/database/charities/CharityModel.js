
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { CHARITY } from '../constants'

/*
 * Represents a Charity.
 * @extends BaseModel
 */
class Charity extends BaseModel {
  static get name () {
    return CHARITY
  }

  static get hashKey () {
    return 'id'
  }

  static get tableName () {
    return tableNames.charities
  }

  static get schema () {
    return {
      id: types.uuid(),
      name: types.string()
    }
    // TODO
    // return {
    //   name: '',
    //   category: '',
    //   logo: '',
    //   image: '',
    //   website: '',
    //   description: '',
    //   impact: ''
    // }
  }

  static get permissions () {
    return {
      get: () => true,
      getAll: () => true
    }
  }
}

Charity.register()

export default Charity
