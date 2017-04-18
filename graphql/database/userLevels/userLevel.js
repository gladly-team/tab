import BaseModel from '../base/model';
import tablesNames from '../tables';
import db from '../database';
import { logger } from '../../utils/dev-tools';

import Async from 'asyncawait/async';
import Await from 'asyncawait/await';

/*
 * Represents a User level. 
 * @extends BaseModel
 */
class UserLevel extends BaseModel {
  
  /**
   * Creates a UserLevel instance.
   * @param {number} id - The instance id in the database.
   */
  constructor(id) {
  	super(id);

  	this.hearts = 0;
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName() {
  	return tablesNames.userLevels;
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields() {
    return [
      'hearts'
    ];
  }
}

/**
 * Fetch the next level for the given level and all time vc.
 * @param {number} level - The user level id. 
 * @param {number} vc - The user all time vc.
 * @return {Promise<UserLevel> | null}  A promise that 
 * resolve into an UserLevel object or null if there is no next level.
 */
var getNextLevelFor = Async (function(level, vc) {
    
  const keys = [
    {id: level + 1},
    {id: level + 2},
    {id: level + 3},
    {id: level + 4},
    {id: level + 5}
  ];

  const args = {
    ProjectionExpression: "id, hearts"
  };

  const levels = Await (UserLevel.getBatch(keys, args));
  
  const sortedLevels = levels.sort((lv1,lv2) => lv1.id > lv2.id? 1: -1);
  for(var index in sortedLevels) {
    if(sortedLevels[index].hearts > vc) {
      return sortedLevels[index];
    }
  }
  
  if(!levels || !levels.length){
    return null;
  }

  return getNextLevelFor(levels[levels.length - 1].id, vc);
});

export {
  UserLevel,
  getNextLevelFor
};
