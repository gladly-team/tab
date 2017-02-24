'use strict';
const db = require('../utils/database');

const getHeartsForUser = (userId) => {
  return db.get({
    TableName: 'Users',
    Key: {
      UserId: userId,
    },
  })
  .then( user => user.hearts);
};

const handler = (event) => {
  if (!event.params.id) {
    return Promise.resolve({
      statusCode: 400,
      body: JSON.stringify({ message: 'The id query param must be set to a valid user id' }),
    });
  }
  return getHeartsForUser(event.params.id)
    .then(
      hearts => {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: `User ${event.params.id} has ${hearts} hearts!` }),
        };
      },
      () => {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: `User ID ${event.params.id} not found ` }),
        };
      }
    );
};

const serverlessHandler = (event, context, callback) => {
  handler(event)
    .then( response => callback(null, response) );
}

module.exports = {
  handler: handler,
  serverlessHandler: serverlessHandler,
}
