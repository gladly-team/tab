import UserModel from './UserModel'

/**
 * Adds the specified virtual currency to the user's vc donated amount.
 * Added `vc` can be negative.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @param {integer} vc - The amount of virtual currency to add to the
 *   user's balance.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const addVcDonatedAllTime = async (userContext, userId, vc = 0) => {
  try {
    var user = await UserModel.update(userContext, {
      id: userId,
      vcDonatedAllTime: { $add: vc },
    })
    return user
  } catch (e) {
    throw e
  }
}

export default addVcDonatedAllTime
