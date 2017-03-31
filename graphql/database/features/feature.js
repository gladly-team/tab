const db = require('../database');
const tablesNames = require('../tables');
const uuid = require('uuid/v4');

const featuresTableName = tablesNames.features;

class Feature {
  constructor(id, name, description, url) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
  }
}

function addFeature(name, description, url) {
  
  const feature = new Feature(uuid(), name, description, url);
  
  var params = {
    TableName: featuresTableName,
    Item: feature
  };

  return db.put(params)
  	.then(data => {
	    // This data object it's empty. Even if it contains an object it wouldn't
	    // be the same object(in memory) that we get when fetching all the 
	    // features. Related to AddFeature mutation in schema.js 
	    return feature;
	}).catch(err => {
	    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
	});
}

function getFeature(id) {
 
  var params = {
      TableName: featuresTableName,
      Key: {
        'id': id
      }
  };

  return db.get(params)
    .then(feature => {
      return feature;
    })
    .catch(function(err) {
     console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    });
}

function getFeatures() {
  var params = {
    TableName: featuresTableName,
    AttributesToGet: [
      'id', 
      'name', 
      'description', 
      'url'
    ],
  };

  return db.scan(params)
  	.then(data => {
  		return data["Items"]
  	})
  	.catch(err => {
	    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
	});
}

export {
  Feature,
  addFeature,
  getFeature,
  getFeatures
};


