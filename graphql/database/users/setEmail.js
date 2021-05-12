import UserModel from './UserModel'

/**
 * Set user's email.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<Object>} response - A promise that resolves into a response object
 * @return {(Object|null)} response.user - a User instance, or null
 */
const setEmail = async (userContext, userId) => {
  try {
    const userInstance = await UserModel.update(userContext, {
      id: userId,
      email: userContext.email,
    })
    return {
      user: userInstance,
    }
  } catch (e) {
    throw e
  }
}

export default setEmail
