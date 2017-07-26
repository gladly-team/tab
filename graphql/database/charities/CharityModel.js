
import dynogels from 'dynogels'
import Joi from 'joi'

import BaseModel from '../base/BaseModel'
import tableNames from '../tables'

/*
 * Represents a Charity.
 * @extends BaseModel
 */
class Charity extends BaseModel {
  static get name () {
    return 'Charity'
  }

  static get hashKey () {
    return 'id'
  }

  static get tableName () {
    return tableNames.charities
  }

  static get schema () {
    return {
      id: dynogels.types.uuid(),
      name: Joi.string()
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
}

Charity.register()

export default Charity
