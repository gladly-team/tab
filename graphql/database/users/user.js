import BaseModel from '../base/model';
import { getNextLevelFor } from '../userLevels/userLevel';
const tablesNames = require('../tables');
const db = require('../database');

import { UserReachedMaxLevelException } from '../../utils/exceptions';
import { logger } from '../../utils/dev-tools';

/*
 * Represents a User. 
 * @extends BaseModel
 */
class User extends BaseModel {

  /**
   * Creates a User instance.
   * @param {string} id - The instance id in the database.
   */
  constructor(id) {
  	super(id);

    this.username = '';
    this.email = '';
    this.vcCurrent = 0;
    this.vcAllTime = 0;
    this.level = 1;

    // This value needs to match the hearts requiered for lv2 in DB.
    this.heartsUntilNextLevel = 5;
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName() {
  	return tablesNames.users;
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields() {
    return [
      'username',
      'email',
      'vcCurrent',
      'vcAllTime',
      'level',
      'heartsUntilNextLevel'
    ];
  }
}


/**
 * Fetch the user by id.
 * @param {string} id - The user id. 
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
function getUser(id) {
	return User.get(id)
        		.then(user => user)
        		.catch(err => {
                logger.error("Error while getting the user.", err);
        		});
}

/**
 * Updates the user Vc by adding the specified vc. Note that 
 * vc can be negative so the user vcCurrent will be decreased by 
 * that amount.
 * Also updates the user level if requiered.
 * @param {string} id - The user id. 
 * @param {number} vc - The user all time vc.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
function updateUserVc(id, vc=0) {
  var updateExpression;
  if(vc > 0){
    updateExpression = `add vcCurrent :val, 
                        vcAllTime :val, 
                        heartsUntilNextLevel :subval`;
  } else {
    //TODO(raul): Look how to accomplish something like
    //  set vcCurrent = max(vcCurrent + :val, 0)
    updateExpression = "set vcCurrent = vcCurrent + :val";
  }

	var params = {
	    UpdateExpression: updateExpression,
	    ExpressionAttributeValues:{
	        ":val": vc,
          ":subval": -vc
	    },
	    ReturnValues:"ALL_NEW"
	};

	return User.update(id, params)
            .then(user => {
              if(user.heartsUntilNextLevel <= 0) {
                return _updateUserLevel(user);
              }
              return user;
            }).then(user => {
              return user;
            })
            .catch(err => {
                logger.error("Error while trying to update user.", err);
        		});
}

function _updateUserLevel(user) {
  return getNextLevelFor(user.level + 1, user.vcAllTime)
            .then(level => {
              if(level) {
                return _updateToLevel(level, user);
              }
              throw new UserReachedMaxLevelException();
            })
            .catch(err => {
                logger.error("Error while trying to update the user level.", err);
            });
}

function _updateToLevel(level, user) {
  const userLevel = level.id - 1;
  //Update user to userLevel.
  const updateExpression = `set #lvl = :level, 
                  heartsUntilNextLevel = :nextLevelHearts`;
  const params = {
      UpdateExpression: updateExpression,
      ExpressionAttributeNames:{
          "#lvl": "level",
      },
      ExpressionAttributeValues:{
          ":level": userLevel,
          ":nextLevelHearts": level.hearts - user.vcAllTime
      },
      ReturnValues:"ALL_NEW"
  };

  return User.update(user.id, params)
            .then(updatedUser => updatedUser)
            .catch(err => {
                logger.error("Error while updating user.", err);
            });
}

export {
  User,
  getUser,
  updateUserVc
};
