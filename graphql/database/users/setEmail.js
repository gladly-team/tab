import UserModel from './UserModel'

/**
 * Set user's email.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} email - The email.
 * @return {Promise<Object>} response - A promise that resolves into a response object
 * @return {(Object|null)} response.user - a User instance, or null
 * @return {Array<{}>} response.errors - an array of error objects
 */
const setEmail = async (userContext, userId, email) => {
  try {
    const userInstance = await UserModel.update(userContext, {
      id: userId,
      email,
    })
    return {
      user: userInstance,
      errors: [],
    }
  } catch (e) {
    throw e
  }
}

export default setEmail
