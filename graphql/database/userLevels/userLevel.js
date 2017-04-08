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

  static getFields() {
    return [
      'hearts'
    ];
  }
}

function getUserLevel(id) {
	return UserLevel.get(id)
		.then(userLevel => userLevel)
		.catch(err => {
		    console.error("Error while getting the user level object. Error JSON:", JSON.stringify(err, null, 2));
		});
}

function getUserLevelsFrom(id) {

    const keys = [
        {id: 2},
        {id: 3},
        {id: 4}
    ];

    const args = {
      ProjectionExpression: "id, hearts"
    };

    return UserLevel.getBatch(keys, args)
    .then(levels => {
      console.log(levels);
      return levels;
    });

    //  var args = {
    //     KeyConditionExpression: "#userLevelId > :val",
    //     ExpressionAttributeNames:{
    //         "#userLevelId": "id"
    //     },
    //     ExpressionAttributeValues: {
    //         ":val":id
    //     }
    // };

    // return UserLevel.query(args)
    // .then(levels => {
    //   return levels;
    // });
}

export {
  UserLevel,
  getUserLevel,
  getUserLevelsFrom
};
