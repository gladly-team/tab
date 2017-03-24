class User {
  constructor(id, name, username, website) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.website = website;
  }
}

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

const lvarayut = new User(1, 'Varayut Lerdkanlayanawat', 'lvarayut', 'https://github.com/lvarayut/relay-fullstack');

let curFeatures = 9;
function addFeature(name, description, url) {
  var table = "Features";
  var params = {
    TableName:table,
    Item:{
        "FeatureId": curFeatures,
        "FeatureName": name, 
        "Description": description, 
        "FeatureUrl": url
    }
  };

  console.log("Adding a new item...");
  docClient.put(params).promise().then(function(data) {
      const feature = params.Item;
      console.error("Added object:", JSON.stringify(feature, null, 2));
  }).catch(function(err) {
     console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
  });

  const feature = params.Item;
  var featureObj = new Feature();
  featureObj.id = feature.FeatureId;
  featureObj.name = feature.FeatureName;
  featureObj.description = feature.Description;
  featureObj.url = feature.FeatureUrl;
  curFeatures += 1;
  return featureObj;

}


function getUser(id) {
  return id === lvarayut.id ? lvarayut : null;
}

// Example of fetching a feature by id from DynamoDB.
function getFeature(id) {
  var table = "Features";

  var params = {
      TableName: table,
      Key: {
        'FeatureId': id
      }
  };

  return docClient.get(params).promise().then(function(feature) {
      var featureObj = new Feature();
      featureObj.id = feature.FeatureId;
      featureObj.name = feature.FeatureName;
      featureObj.description = feature.Description;
      featureObj.url = feature.FeatureUrl;
      return featureObj;
  }).catch(function(err) {
     console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
  });
}

// Example of fetching many from DynamoDB.
function getFeatures() {
  var table = "Features";

  var params = {
      TableName: table,
      ProjectionExpression: "FeatureId, FeatureName, Description, FeatureUrl",
  };

  return docClient.scan(params).promise().then(function(data) {
    return data.Items.map((feature, i) => {
        var featureObj = new Feature();
        featureObj.id = feature.FeatureId;
        featureObj.name = feature.FeatureName;
        featureObj.description = feature.Description;
        featureObj.url = feature.FeatureUrl;
        return featureObj;
      });
  }).catch(function(err) {
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
