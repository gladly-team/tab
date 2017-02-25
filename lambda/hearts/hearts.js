'use strict';
const db = require('../utils/database');

/**
 * Fetches a user ID from the database.
 * @constructor
 * @param {integer} userId - The user's ID
 * @return {integer} The number of Hearts a user has.
 */
const getHeartsForUser = (userId) => {
  return db.get({
    TableName: 'Users',
    Key: {
      UserId: userId,
    },
  })
  .then( data => data.Item.VcCurrent);
};

const handler = (event) => {
  if (!event.params.id) {
    return Promise.resolve({
      statusCode: 400,
      body: JSON.stringify({ message: 'The id query param must be set to a valid user id' }),
    });
  }
  let userId = parseInt(event.params.id, 10) || 0;
  return getHeartsForUser(userId)
    .then(
      (hearts) => {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: `User ${userId} has ${hearts} hearts!` }),
        };
      },
      (err) => {
        console.log('Error:', err);
        return {
          statusCode: 404,
          body: JSON.stringify({ message: `User ID ${userId} not found ` }),
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
