'use strict'

// Note: after deleting this function, we can remove
// the following packages from dependencies:
// joi, uuid, dynogels, bluebird

import UserModel from 'database/users/UserModel'
import {
  USER_BACKGROUND_OPTION_COLOR,
  USER_BACKGROUND_OPTION_CUSTOM,
  USER_BACKGROUND_OPTION_DAILY,
  USER_BACKGROUND_OPTION_PHOTO
} from 'database/constants'

import BackgroundImageModel from 'database/backgroundImages/BackgroundImageModel'

import updateUserWidgetData from 'database/widgets/userWidget/updateUserWidgetData'
import updateUserWidgetEnabled from 'database/widgets/userWidget/updateUserWidgetEnabled'

import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
import moment from 'moment'

import tfacMgr from './tfac'

/**
 * Sets the user profile data for the user
 * currently beign migrated.
 * @param {Object} userprofile - The user profile data.
 * @return {boolean} True if data was saved without any
 * problems false otherwise.
 */
const setUserProfile = Async((userProfile) => {
  try {
    const user = {}
    user.id = userProfile.id
    user.username = userProfile.username
    user.email = userProfile.email
    user.vcCurrent = userProfile.vcCurrent
    user.vcAllTime = userProfile.vcAllTime
    user.level = userProfile.level
    user.heartsUntilNextLevel = userProfile.heartsUntilNextLevel

    user.backgroundOption = USER_BACKGROUND_OPTION_PHOTO
    switch (userProfile.backgroundOption) {
      case USER_BACKGROUND_OPTION_CUSTOM:
        user.backgroundOption = USER_BACKGROUND_OPTION_CUSTOM
        break
      case USER_BACKGROUND_OPTION_COLOR:
        user.backgroundOption = USER_BACKGROUND_OPTION_COLOR
        break
      case USER_BACKGROUND_OPTION_DAILY:
        user.backgroundOption = USER_BACKGROUND_OPTION_DAILY
        break
      default:
        break
    }

    // FIXME: requires userContext to work.
    const bkgImages = Await(BackgroundImageModel.getAll())

    user.backgroundImage = {
      id: 'fb5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'Mountain Lake',
      fileName: 'lake.jpg',
      timestamp: moment.utc().format()
    }

    for (var index in bkgImages) {
      var bkg = bkgImages[index]
      if (bkg.name === userProfile.backgroundImage) {
        user.backgroundImage = {
          id: bkg.id,
          name: bkg.name,
          fileName: bkg.fileName,
          timestamp: moment.utc().format()
        }
        break
      }
    }

    user.customImage = userProfile.customImage || null
    user.backgroundColor = userProfile.backgroundColor || null

    Await(UserModel.createUser(user))

    return true
  } catch (err) {
    console.log('Error while setting the user profile data', err)
    // Log the err in here
    return false
  }
})

/**
 * Setup the bookmarks for the user.
 * @param {Object[]} bookmarks - The bookmark list.
 * @return {boolean} True if data was saved without any
 * problems false otherwise.
 */
const setBookmarksData = Async((userId, bookmarks) => {
  try {
    if (!bookmarks || !bookmarks.length) { return true }

    const bookmarkWidgetId = 'notecb66-c544-465c-96e9-20646060d8d2'

    Await(updateUserWidgetEnabled(userId, bookmarkWidgetId, true))
    Await(updateUserWidgetData(
        userId,
        bookmarkWidgetId,
        { bookmarks: bookmarks }))

    return true
  } catch (err) {
    console.log('Error while setting the bookmarks data', err)
    return false
  }
})

/**
 * Setup the notes for the user.
 * @param {Object[]} notes - The note list.
 * @return {boolean} True if data was saved without any
 * problems false otherwise.
 */
const setNotesData = Async((userId, notes) => {
  function randomString (length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = ''
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
  }

  try {
    if (!notes || !notes.length) { return true }

    const notesWidgetId = 'book7d35-639b-49d4-a822-116cc7e5c2e2'

    const data = []
    for (var index in notes) {
      data.push({
        id: randomString(6),
        color: notes[index].color,
        content: notes[index].content
      })
    }

    Await(updateUserWidgetEnabled(userId, notesWidgetId, true))
    Await(updateUserWidgetData(
        userId,
        notesWidgetId,
        { notes: data }))

    return true
  } catch (err) {
    // Log the err in here
    return false
  }
})

const handler = Async((event) => {
  // Check the received key in here to authenticate the request.

  if (!event.queryStringParameters.id) {
    return Promise.resolve({
      statusCode: 400,
      body: JSON.stringify({ message: 'The id query param must be set to a valid user id' })
    })
  }

  let userId = event.queryStringParameters.id

  /// ///////////  Migrate User Profile Data  ///////////////
  const userProfile = Await(tfacMgr.fetchUserProfile(userId))
  Await(setUserProfile(userProfile))

  /// //////////////  Migrate User Widgets  ///////////////////

  // Bookmarks
  const bookmarks = Await(tfacMgr.fetchBookmarks(userId))
  Await(setBookmarksData(userProfile.id, bookmarks))

  // Notes
  const notes = Await(tfacMgr.fetchNotes(userId))
  Await(setNotesData(userProfile.id, notes))

  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({ message: 'Migration successful.' })
  })
})

const serverlessHandler = (event, context, callback) => {
  handler(event)
    .then(response => callback(null, response))
}

module.exports = {
  handler: handler,
  serverlessHandler: serverlessHandler
}
