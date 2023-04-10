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

  // TODO(spicer): I don't think we need this anymore but we should confirm
  if (user.causeId === DEPRECATED_CATS_CAUSE_ID) {
    user = await UserModel.update(userContext, {
      causeId: CATS_CAUSE_ID,
    })
  }

  // This is a temporary fix for users who were created with v4BetaEnabled
  // But never got their causeId set to a cause
  if (
    user.v4BetaEnabled &&
    user.v4BetaEnabled === true &&
    user.causeId === 'no-cause'
  ) {
    user = await UserModel.update(userContext, {
      id: userId, // need to include this or we get permission denied
      causeId: CATS_CAUSE_ID,
    })
  }

  // If we still have no causeId this likely is a legacy user or
  // someone is in the sign up process and the cause does not mater.
  if (user.causeId === 'no-cause') {
    return null
  }

  return getCause(user.causeId)
}

export default getCauseByUser
