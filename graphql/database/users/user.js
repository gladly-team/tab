import BaseModel from '../base/model';
import { UserLevel } from '../userLevels/userLevel';
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

    // This value needs to match the hearts requiered for lv2 in DB.
    this.heartsUntilNextLevel = 200;
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
	console.log('getUser', id);
	return User.get(id)
		.then(user => user)
		.catch(err => {
		    console.error("Error while getting the user. Error JSON:", JSON.stringify(err, null, 2));
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
    .then(data => {
      console.log('Update user response:', data);
      const attrs = data['Attributes'];
      return updateUserLevel(User.deserialize(attrs));
    })
    .then(user => {
      console.log('Get user after update response', user);
      return user;
    })
    .catch(err => {
		    console.error("Error while trying to update user: "  + userId + " vc. Error JSON:", JSON.stringify(err, null, 2));
		});
}

function updateUserLevel(user) {
    var heartsUntilNextLevel = user.heartsUntilNextLevel;
    var nextLevel = data[level] + 1;
    
    const keys = [
        {
         "id": {
           N: (nextLevel + 1).toString()
          }
        },
        {
         "id": {
           N: (nextLevel + 2).toString()
          }
        },
        {
         "id": {
           N: (nextLevel + 3).toString()
          }
        }
    ];

    const args = {
      ProjectionExpression: "hearts"
    };

    // return UserLevel.getBatch(keys, args)
    // .then(levels => {
    //   console.log(levels);
    //   return levels;
    // });

    // UserLevel.getBatch(keys, args)
    // .then(levels => {
    //   console.log('getBatch', levels);
    //   return levels;
    // })
    // .catch(err => {
    //     console.error("getBatch Error JSON:", JSON.stringify(err, null, 2));
    // });

    return User.get(user.id)
        .then(user => user)
        .catch(err => {
            console.error("Error JSON:", JSON.stringify(err, null, 2));
        });
}

export {
  User,
  getUser,
  updateUserVc
};
