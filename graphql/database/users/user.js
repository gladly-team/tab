import BaseModel from '../base/model';
const tablesNames = require('../tables');
const db = require('../database');

class User extends BaseModel {
  constructor(id) {
  	super(id);

    this.username = '';
    this.email = '';
    this.vcCurrent = 0;
    this.vcAllTime = 0;
    this.level = 1;
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
      'level'
    ];
  }
}

function getUser(id) {
	
	return User.get(id)
		.then(user => user)
		.catch(err => {
		    console.error("Error while getting the user. Error JSON:", JSON.stringify(err, null, 2));
		});
}

function updateUserVc(userId, vc=0) {

  var updateExpression;
  if(vc > 0){
    updateExpression = "set vcCurrent = vcCurrent + :val, vcAllTime = vcAllTime + :val";
  } else {
    updateExpression = "set vcCurrent = vcCurrent + :val";
  }

	var params = {
	    UpdateExpression: updateExpression,
	    ExpressionAttributeValues:{
	        ":val": vc
	    },
	    ReturnValues:"UPDATED_NEW"
	};

	return User.update(userId, params)
	  	.then(data => {
		    return {userId: userId, data: data};
		}).catch(err => {
		    console.error("Error while trying to update user: "  + userId + " vc. Error JSON:", JSON.stringify(err, null, 2));
		});
}

export {
  User,
  getUser,
  updateUserVc
};
