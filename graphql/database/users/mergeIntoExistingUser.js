import UserModel from './UserModel'

/**
 * Merge an existing user into an existing user account, because
 * they are owned by the same person. This happens when we create
 * an anonymous user account for an existing user who is not
 * logged in, but then they log in.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const mergeIntoExistingUser = async (userContext, userId) => {
  try {
    await UserModel.update(userContext, {
      id: userId,
      mergedIntoExistingUser: true,
    })
  } catch (e) {
    throw e
  }
  return { success: true }
}

export default mergeIntoExistingUser
