// This file is just an example.

var AWS = require('./aws-client');
var docClient = new AWS.DynamoDB.DocumentClient();

var table = 'Users';

var vc_current = 50;
var user_id = 2;

var params = {
    TableName: table,
    Key:{
        'vc_current': vc_current,
        'user_id': user_id
    }
};

docClient.get(params, function(err, data) {
    if (err) {
        console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('GetItem succeeded:', JSON.stringify(data, null, 2));
    }
});
