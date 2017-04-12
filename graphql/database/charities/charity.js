import BaseModel from '../base/model';
import database from '../database';
import tablesNames from '../tables';
import { getNextLevelFor } from '../userLevels/userLevel';
import { UserReachedMaxLevelException } from '../../utils/exceptions';
import { logger } from '../../utils/dev-tools';

import Async from 'asyncawait/async';
import Await from 'asyncawait/await';

/*
 * Represents a Charity. 
 * @extends BaseModel
 */
class Charity extends BaseModel {

  /**
   * Creates a Charity instance.
   * @param {string} id - The instance id in the database.
   */
  constructor(id) {
  	super(id);

    this.name = '';
    this.category = '';
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName() {
  	return tablesNames.charities;
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields() {
    return [
      'name',
      'category'
    ];
  }
}

/**
 * Fetch a charity by id.
 * @param {string} id - The charity id. 
 * @return {Promise<Charity>}  A promise that resolve into a Charity instance.
 */
function getCharity(id) {
  return Charity.get(id)
            .then(charity => charity)
            .catch(err => {
                logger.error("Error while getting the charity.", err);
            });
}

/**
 * Fetch all the charities.
 * @return {Promise<Charity[]>}  A promise that resolve 
 * into a list of Charity.
 */
function getCharities() {
  var params = {
      ProjectionExpression: "#id, #name, #category",
      ExpressionAttributeNames: {
          "#id": "id",
          "#name": "name",
          "#category": "category",
      }
  };
	return Charity.getAll(params)
        		.then(charities => charities)
        		.catch(err => {
                logger.error("Error while fetching the charities.", err);
        		});
}

export {
  Charity,
  getCharity,
  getCharities
};
