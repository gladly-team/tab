class User {
  constructor(id, name, username, website) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.website = website;
  }
}

// We are not doing any mapping to this model,
// We directly use the object returned by 
// dynamoDB. (?)
class Feature {
  constructor(id, name, description, url) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
  }
}

var AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeKey123',
  secretAccessKey: 'fakeSecretKey456'
});
var docClient = new AWS.DynamoDB.DocumentClient();
const featuresTableName = 'Features';

const lvarayut = new User(1, 'Varayut Lerdkanlayanawat', 'lvarayut', 'https://github.com/lvarayut/relay-fullstack');

let curFeatures = 9;
function addFeature(name, description, url) {
  const feature = new Feature(curFeatures, name, description, url);
  curFeatures += 1;
  var params = {
    TableName: featuresTableName,
    Item: feature
  };

  return docClient.put(params).promise().then(data => {
    // This data object it's empty. Even if it contains an object it wouldn't
    // be the same object(in memory) that we get when fetching all the 
    // features. Related to AddFeature mutation in schema.js 
    console.error("Added new feature: ", JSON.stringify(feature, null, 2));
    return feature;
  }).catch(err => {
     console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
  });
}

function getUser(id) {
  return id === lvarayut.id ? lvarayut : null;
}

// Example of fetching a feature by id from DynamoDB.
function getFeature(id) {
 
  var params = {
      TableName: featuresTableName,
      Key: {
        'id': id
      }
  };

  return docClient.get(params).promise()
    .then(feature => {
      return feature;
    })
    .catch(function(err) {
     console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    });
}

// Example of fetching many from DynamoDB.
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

  return docClient.scan(params).promise().then(data => data["Items"]).catch(err => {
    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
  });
}

export {
  User,
  Feature,
  getUser,
  getFeature,
  getFeatures,
  addFeature
};
