import BaseModel from '../base/model';
const tablesNames = require('../tables');
const db = require('../database');

import { logger } from '../../utils/dev-tools';

class UserLevel extends BaseModel {
  
  constructor(id) {
  	super(id);

  	this.hearts = 0;
  }

  static getTableName() {
  	return tablesNames.userLevels;
  }

  static getFields() {
    return [
      'hearts'
    ];
  }
}

function getNextLevelFor(level, vc) {
    
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

  return UserLevel.getBatch(keys, args)
            .then(levels => {
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
            })
            .catch(err => {
                logger.error('Error while fething the user levels', err);
            });
}

export {
  UserLevel,
  getNextLevelFor
};
