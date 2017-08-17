
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { CHARITY } from '../constants'
import config from '../../config'

const mediaRoot = config.S3_ENDPOINT

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
      name: types.string(),
      category: types.string(),
      logo: types.string(),
      image: types.string(),
      website: types.string().uri(),
      description: types.string(),
      impact: types.string()
    }
  }

  static get permissions () {
    return {
      get: () => true,
      getAll: () => true
    }
  }

  static get fieldDeserializers () {
    return {
      logo: (fileName) => {
        return `${mediaRoot}/img/charities/charity-logos/${fileName}`
      },
      image: (fileName) => {
        return `${mediaRoot}/img/charities/charity-post-donation-images/${fileName}`
      }
    }
  }
}

Charity.register()

export default Charity
