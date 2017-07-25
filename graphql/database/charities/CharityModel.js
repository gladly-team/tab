
import Joi from 'joi'

import BaseModel from '../base/BaseModel'
import tableNames from '../tables'
import { logger } from '../../utils/dev-tools'

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

  // TODO: write tests
  static getCharity (id) {
    console.log('getCharity', id)
    return Charity.get(id)
      .then(charity => charity)
      .catch(err => {
        logger.error('Error while getting the charity.', err)
      })
  }

  // TODO: write tests
  static getCharities () {
    return Charity.getAll()
      .then(charities => charities)
      .catch(err => {
        logger.error('Error while fetching the charities.', err)
      })
  }
}

Charity.register()

export default Charity
