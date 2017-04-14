import BaseModel from '../base/model';
import { updateUserVc } from '../users/User';

import tablesNames from '../tables';
import { logger } from '../../utils/dev-tools';



import moment from 'moment';
import Async from 'asyncawait/async';
import Await from 'asyncawait/await';

/*
 * Represents a VcDonationLog. 
 * @extends BaseModel
 */
class VcDonationLog extends BaseModel {

  /**
   * Creates a VcDonationLog instance.
   * @param {string} id - The user id.
   */
  constructor(userId) {
  	super(userId);

    this.charityId = '';
    this.vcDonated = 0;
    this.timestamp = '';
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName() {
  	return tablesNames.vcDonationLog;
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields() {
    return [
      'charityId',
      'vcDonated',
      'timestamp'
    ];
  }
}

/**
 * Add a new dontation log to the DB.
 * @param {string} userId - The id of the user making the donation. 
 * @param {string} charityId - The id of the targeted charity. 
 * @param {number} vcDonated - The amount of vc donated. 
 * @return {Promise<Object>}  A promise that resolve into a 
 * response object like the following:
 * {
 *   Item: {...your item here...},
 *   Data: {...the data returned by the database...}
 * }
 */
function addVcDonationLog(userId, charityId, vcDonated) {
  const vcDontationLog = new VcDonationLog(userId);
  vcDontationLog.charityId = charityId;
  vcDontationLog.vcDonated = vcDonated;
  vcDontationLog.timestamp = moment.utc().format();
  return VcDonationLog.add(vcDontationLog)
            .catch(err => {
                logger.error("Error while adding a new donation log.", err);
            });
}

export {
  VcDonationLog,
  addVcDonationLog
};
