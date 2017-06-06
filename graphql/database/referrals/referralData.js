import BaseModel from '../base/model';
import { updateUserVc } from '../users/user';

import tablesNames from '../tables';
import { logger } from '../../utils/dev-tools';

import moment from 'moment';
import Async from 'asyncawait/async';
import Await from 'asyncawait/await';

/*
 * Represents a ReferralData. 
 * @extends BaseModel
 */
class ReferralData extends BaseModel {

  /**
   * Creates a ReferralData instance.
   * @param {string} id - The referred user id.
   */
  constructor(userId, referringUser) {
  	super(userId);
    this.referringUser = referringUser;
    this.timestamp = moment.utc().format();
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName() {
  	return tablesNames.referralDataLog;
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields() {
    return [
      'referringUser',
      'timestamp'
    ];
  }
}

/**
 * Add a new referral data log to the DB.
 * @param {string} userId - The referred user id.
 * @param {object} referralData - The referral data. 
 * @return {Promise<Object>}  A promise that resolve into a referral data log.
 */
function logReferralData(userId, referralData) {
  const referringUser = referralData.referringUser;
  const referralObj = new ReferralData(userId, referringUser);
  return ReferralData.add(referralObj)
            .catch(err => {
                logger.error("Error while adding a new referral data log.", err);
            });
}

export {
  ReferralData,
  logReferralData
};
