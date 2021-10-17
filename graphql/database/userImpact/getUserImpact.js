import UserImpactModel from './UserImpactModel'
import UserModel from '../users/UserModel'
import CauseModel from '../cause/CauseModel'
import { CATS_CHARITY_ID } from '../constants'
import {
  getPermissionsOverride,
  CAUSES_OVERRIDE,
} from '../../utils/permissions-overrides'

const override = getPermissionsOverride(CAUSES_OVERRIDE)
/**
 * gets a user impact record
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a UserImpact instance.
 */
const getUserImpact = async (userContext, userId) => {
  try {
    const user = await UserModel.get(userContext, userId)
    const cause = await CauseModel.get(override, user.causeId)
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
