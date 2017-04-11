import BaseModel from '../base/model';
import { getNextLevelFor } from '../userLevels/userLevel';
const tablesNames = require('../tables');
const db = require('../database');

import { UserReachedMaxLevelException } from '../../utils/exceptions';
import { logger } from '../../utils/dev-tools';

class User extends BaseModel {
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

  static getTableName() {
  	return tablesNames.users;
  }

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

function getUser(id) {
	return User.get(id)
        		.then(user => user)
        		.catch(err => {
                logger.error("Error while getting the user.", err);
        		});
}

function updateUserVc(userId, vc=0) {
  var updateExpression;
  if(vc > 0){
    updateExpression = `add vcCurrent :val, 
                        vcAllTime :val, 
                        heartsUntilNextLevel :subval`;
  } else {
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

	return User.update(userId, params)
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
