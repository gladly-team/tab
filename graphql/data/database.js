/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://dynamodb:8000',
  accessKeyId: 'fakeKey123',
  secretAccessKey: 'fakeSecretKey456'
});
var docClient = new AWS.DynamoDB.DocumentClient();



// Model types
class User {}
class Widget {}
class Charity {}

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
var widgets = ['Hi, what\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;
  return widget;
});

function getCharities() {
  var table = "Charities";

  var params = {
      TableName: table,
      ProjectionExpression: "CharityId, CharityName",
  };

  return docClient.scan(params).promise().then(function(data) {
    console.log("Async scan succeeded:", JSON.stringify(data, null, 2));
    return data.Items.map((charity, i) => {
        var charityObj = new Charity();
        charityObj.id = charity.CharityId;
        charityObj.name = charity.CharityName;
        return charityObj;
      });
  }).catch(function(err) {
     console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
  });
}


module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getCharities: getCharities,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  User,
  Widget,
};
