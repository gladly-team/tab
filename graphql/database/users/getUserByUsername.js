import UserModel from './UserModel'
import {
  getPermissionsOverride,
  GET_REFERRER_BY_USERNAME_OVERRIDE,
} from '../../utils/permissions-overrides'

const getReferrerOverride = getPermissionsOverride(
  GET_REFERRER_BY_USERNAME_OVERRIDE
)

/**
 * Fetch the user by username.
 * @param {object} userContext - The user authorizer object.
 * @param {string} username - The user's username.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const getUserByUsername = async (userContext, username) =>
  // NOTE: this currently uses a permission override so cannot
  // be used securely in user-accessible queries.
  // The userContext does not include the user's username, so
  // there's no clean way to verify item ownership based on username
  // lookup prior to making the query. For now, require a permissions
  // override to access this secondary index.
  UserModel.query(getReferrerOverride, username)
    .usingIndex('UsersByUsername')
    .execute()
    .then(result => {
      if (result.length > 0) {
        return result[0]
      }
      return null
    })

export default getUserByUsername
