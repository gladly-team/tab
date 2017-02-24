
var AWS = require('../aws-client');
var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Users",
    KeySchema: [       
        { AttributeName: "user_id", KeyType: "HASH"},  // Partition key
        { AttributeName: "vc_current", KeyType: "RANGE" }  // Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "user_id", AttributeType: "N" },
        { AttributeName: "vc_current", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
