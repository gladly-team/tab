// TODO: delete this file
import BaseModel from '../base/model'
import tablesNames from '../tables'
import { logger } from '../../utils/dev-tools'

/*
 * Represents a Charity.
 * @extends BaseModel
 */
class Charity extends BaseModel {
  /**
   * Creates a Charity instance.
   * @param {string} id - The instance id in the database.
   */
  constructor (id) {
    super(id)

    this.name = ''
    this.category = ''
    this.logo = ''
    this.image = ''
    this.website = ''
    this.description = ''
    this.impact = ''
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName () {
    return tablesNames.charities
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields () {
    return [
      'name',
      'category',
      'logo',
      'image',
      'website',
      'description',
      'impact'
    ]
  }
}

/**
 * Fetch a charity by id.
 * @param {string} id - The charity id.
 * @return {Promise<Charity>}  A promise that resolve into a Charity instance.
 */
function getCharity (id) {
  return Charity.get(id)
    .then(charity => charity)
    .catch(err => {
      logger.error('Error while getting the charity.', err)
    })
}

/**
 * Fetch all the charities.
 * @return {Promise<Charity[]>}  A promise that resolve
 * into a list of Charity.
 */
function getCharities () {
  return Charity.getAll()
    .then(charities => charities)
    .catch(err => {
      logger.error('Error while fetching the charities.', err)
    })
}

export {
  Charity,
  getCharity,
  getCharities
}
