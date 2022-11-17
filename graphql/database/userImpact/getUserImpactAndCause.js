import UserImpactModel from './UserImpactModel'
import UserModel from '../users/UserModel'
import getCause from '../cause/getCause'

/**
 * gets a user impact record
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a UserImpact and Cause instance.
 */
const getUserImpactAndCause = async (userContext, userId) => {
  const user = await UserModel.get(userContext, userId)
  const cause = await getCause(user.causeId)
  const userImpact = (
    await UserImpactModel.getOrCreate(userContext, {
      userId,
      charityId: cause.charityId,
    })
  ).item
  return {
    cause,
    userImpact,
  }
}
export default getUserImpactAndCause
