import moment from 'moment'
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
  const cause = getCause(user.causeId)

  // A little hacky but here is where we record usage by a user.
  // TODO(spicer): find a better place for this since the extension only calls then every min. a user is using it.
  await UserModel.update(getOverride, {
    id: userId,
    lastShopOpenTimestamp: moment.utc().toISOString(),
    shopSignupTimestamp: user.shopSignupTimestamp || moment.utc().toISOString(),
  })

  return cause
}

export default getCauseForWildfire
