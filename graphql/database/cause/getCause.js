import UserModel from '../users/UserModel'
import CauseModel from './CauseModel'
import {
  getPermissionsOverride,
  CAUSES_OVERRIDE,
} from '../../utils/permissions-overrides'

const override = getPermissionsOverride(CAUSES_OVERRIDE)
/**
 * gets a cause record based on user record
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a Cause instance.
 */
const getCause = async (userContext, userId) => {
  const user = await UserModel.get(userContext, userId)
  return CauseModel.get(override, user.causeId)
}
export default getCause
