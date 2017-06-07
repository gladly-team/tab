'use strict';

import Async from 'asyncawait/async';
import Await from 'asyncawait/await';

import tfacMgr from './tfac';

/**
 * Sets the user profile data for the user 
 * currently beign migrated.
 * @param {Object} userprofile - The user profile data.
 * @return {boolean} True if data was saved without any 
 * problems false otherwise.
 */
const setUserProfile = Async((userProfile) => {
  return true;
});

/**
 * Setup the bookmarks for the user.
 * @param {Object[]} bookmarks - The bookmark list.
 * @return {boolean} True if data was saved without any 
 * problems false otherwise.
 */
const setBookmarksData = Async((bookmarks) => {
  return true;
});

/**
 * Setup the notes for the user. 
 * @param {Object[]} notes - The note list.
 * @return {boolean} True if data was saved without any 
 * problems false otherwise.
 */
const setNotesData = Async((notes) => {
  return true;
});

const handler = Async((event) => {

  // Check the received key in here to authenticate the request.
  
  if (!event.queryStringParameters.id) {
    return Promise.resolve({
      statusCode: 400,
      body: JSON.stringify({ message: 'The id query param must be set to a valid user id' }),
    });
  }

  let userId = event.queryStringParameters.id;

  //////////////  Migrate User Profile Data  ///////////////
  const userProfile = Await (tfacMgr.fetchUserProfile(userId));
  Await (setUserProfile(userProfile));

  /////////////////  Migrate User Widgets  ///////////////////

  // Bookmarks
  const bookmarks = Await (tfacMgr.fetchBookmarks(userId));
  Await (setBookmarksData(bookmarks));

  // Notes
  const notes = Await (tfacMgr.fetchNotes(userId));
  Await (setNotesData(notes));

  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({ message: 'Migration successful.' }),
  });
});

const serverlessHandler = (event, context, callback) => {
  handler(event)
    .then( response => callback(null, response) );
}

module.exports = {
  handler: handler,
  serverlessHandler: serverlessHandler,
}

