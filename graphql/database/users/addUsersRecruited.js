
import UserModel from './UserModel'
import {
  getPermissionsOverride,
  ADD_NUM_USERS_RECRUITED_OVERRIDE
} from '../../utils/permissions-overrides'
const override = getPermissionsOverride(ADD_NUM_USERS_RECRUITED_OVERRIDE)

/**
 * Add to the count of referred users.
 * @param {string} referringUserId - The user id.
 * @param {integer} numUsersRecruited - The number of users to add to the
 *   user's numUsersRecruited count.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const addUsersRecruited = async (referringUserId, numUsersRecruited = 1) => {
  try {
    var user = await UserModel.update(override, {
      id: referringUserId,
      numUsersRecruited: {$add: numUsersRecruited}
    })
    return user
  } catch (e) {
    throw e
  }
}

export default addUsersRecruited
