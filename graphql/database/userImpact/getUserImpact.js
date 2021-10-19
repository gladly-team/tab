import UserImpactModel from './UserImpactModel'
import UserModel from '../users/UserModel'
import { CATS_CHARITY_ID } from '../constants'
import getCause from '../cause/getCause'

/**
 * gets a user impact record
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a UserImpact instance.
 */
const getUserImpact = async (userContext, userId) => {
  try {
    const user = await UserModel.get(userContext, userId)
    const cause = await getCause(user.causeId)
    return (await UserImpactModel.getOrCreate(userContext, {
      userId,
      charityId: cause.charityId,
    })).item

    // fallback to old method until we seed cause data in production
  } catch (e) {
    return (await UserImpactModel.getOrCreate(userContext, {
      userId,
      charityId: CATS_CHARITY_ID,
    })).item
  }
}
export default getUserImpact
