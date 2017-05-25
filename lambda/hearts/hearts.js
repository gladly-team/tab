'use strict';

import db from '../utils/database';
import tablesNames from '../utils/tables';

/**
 * Fetches a user ID from the database.
 * @constructor
 * @param {integer} userId - The user's ID
 * @return {integer} The number of Hearts a user has.
 */
const getHeartsForUser = (userId) => {
  return db.get({
    TableName: tablesNames.users,
    Key: {
      id: userId,
    },
  })
  .then( data => data.Item.vcCurrent);
};

const handler = (event) => {
  if (!event.queryStringParameters.id) {
    return Promise.resolve({
      statusCode: 400,
      body: JSON.stringify({ message: 'The id query param must be set to a valid user id' }),
    });
  }
  let userId = event.queryStringParameters.id;
  return getHeartsForUser(userId)
    .then(
      (hearts) => {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: `User ${userId} has ${hearts} hearts!` }),
        };
      },
      (err) => {
        // console.log('Error:', err);
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
