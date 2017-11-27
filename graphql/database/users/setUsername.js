
import UserModel from './UserModel'
import getUserByUsername from './getUserByUsername'
import logger from '../../utils/logger'

/**
 * Set user's username.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} username - The username.
 * @return {Promise<Object>} response - A promise that resolves into a response object
 * @return {(Object|null)} response.user - a User instance, or null
 * @return {Array<{}>} response.errors - an array of error objects
 */
const setUsername = async (userContext, userId, username) => {
  try {
    // See if the username is taken.
    var usernameAlreadyExists = true
    try {
      const existingUser = await getUserByUsername(userContext, username)

      // If there's a user with the same username but a different ID
      // from this user, the username is taken.
      usernameAlreadyExists = (
        existingUser &&
        existingUser.id !== userId
      )
    } catch (e) {
      // This is an unexpected failure. Return an error.
      logger.error(e)
      return {
        user: null,
        errors: [{
          code: 'USERNAME_LOOKUP_FAILURE',
          message: 'Could not verify if username is taken or not'
        }]
      }
    }

    // If the username exists, return a validation error.
    if (usernameAlreadyExists) {
      return {
        user: null,
        errors: [{
          code: 'USERNAME_DUPLICATE',
          message: 'Username already exists'
        }]
      }
    }

    // Update the username.
    const userInstance = await UserModel.update(userContext, {
      id: userId,
      username: username
    })
    return {
      user: userInstance,
      errors: []
    }
  } catch (e) {
    throw e
  }
}

export default setUsername
