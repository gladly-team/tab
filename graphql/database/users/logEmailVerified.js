
import UserModel from './UserModel'

/**
 * Log that a user's email is verified, using the trustworthy
 * user context know that the email is truly verified. Then,
 * perform any other actions that occur when a user is
 * verified.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const logEmailVerified = async (userContext, userId) => {
  var returnedUser
  try {
    returnedUser = await UserModel.update(userContext, {
      id: userId,
      emailVerified: userContext.emailVerified
    })
  } catch (e) {
    throw e
  }

  // If the user's email is verified, reward their user
  // referrer if one exists.
  if (userContext.emailVerified) {
    // TODO
  }

  return returnedUser
}

export default logEmailVerified
