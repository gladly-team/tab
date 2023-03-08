import getCause from './getCause'
import UserModel from '../users/UserModel'
import {
  getPermissionsOverride,
  WILDFIRE_BY_USER_ID_OVERRIDE,
} from '../../utils/permissions-overrides'

const getOverride = getPermissionsOverride(WILDFIRE_BY_USER_ID_OVERRIDE)

// This is called to resolve the wildfire root field in our GraphQL schema.
const getCauseForWildfire = async (userId) => {
  const user = await UserModel.get(getOverride, userId)

  // We return the cause record for the user.
  return getCause(user.causeId)
}

export default getCauseForWildfire
