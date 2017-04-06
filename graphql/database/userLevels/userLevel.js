import BaseModel from '../base/model';
const tablesNames = require('../tables');
const db = require('../database');

class UserLevel extends BaseModel {
  
  constructor(id, hearts) {
  	super(id);

  	// Model Requiered fields.
  	this.hearts = hearts;
  }

  static getTableName() {
  	return tablesNames.userLevels;
  }

  static deserialize(obj) {
  	
  	const userLevel = new UserLevel(
  		obj.id, 
  		obj.hearts);

  	return userLevel;
  }
}

function getUserLevel(id) {
	return UserLevel.get(id)
		.then(userLevel => userLevel)
		.catch(err => {
		    console.error("Error while getting the user level object. Error JSON:", JSON.stringify(err, null, 2));
		});
}

export {
  UserLevel,
  getUserLevel
};
