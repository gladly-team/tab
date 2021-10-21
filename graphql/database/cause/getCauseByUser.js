import UserModel from '../users/UserModel'
import getCause from './getCause'

const DEPRECATED_CATS_CAUSE_ID = '7f8476b9-f83f-47ac-8173-4a1c2ec3dc29'
const CATS_CAUSE_ID = 'CA6A5C2uj'

/**
 * Get a cause record based on user record
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a Cause instance.
 */

const getCauseByUser = async (userContext, userId) => {
  let user = await UserModel.get(userContext, userId)
  if (user.causeId === DEPRECATED_CATS_CAUSE_ID) {
    user = await UserModel.update(userContext, {
      causeId: CATS_CAUSE_ID,
    })
  }
  return getCause(user.causeId)
}

export default getCauseByUser
