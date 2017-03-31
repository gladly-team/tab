import BaseModel from '../base/model';
const tablesNames = require('../tables');
const db = require('../database');

class User extends BaseModel {
  
  constructor(id, name, username, email) {
  	super(id);

  	// Model Requiered fields.
  	this.name = name;
    this.username = username;
    this.email = email;

  	// Model optional fields with default values.
    this.vcCurrent = 0;
  }

  static getTableName() {
  	return tablesNames.users;
  }

  static deserialize(obj) {
  	
  	const user = new User(
  		obj.id, 
  		obj.name, 
  		obj.username, 
  		obj.email);

  	user.vcCurrent = obj.vcCurrent;
  	return user;
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

	var params = {
	    UpdateExpression: "set vcCurrent = vcCurrent + :val",
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
