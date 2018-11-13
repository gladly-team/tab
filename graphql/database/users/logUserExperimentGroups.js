
import UserModel from './UserModel'
import { isEmpty, isNil } from 'lodash/lang'
import {
  getValidatedExperimentGroups
} from '../../utils/experiments'

/**
 * Update the user to include the experiment groups to which they've
 * been assigned. Validate the group values and only store them if
 * they're valid.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user's ID.
 * @param {object|null} experimentGroups - Any experimental test groups to
 *   which the user has been assigned. This will take the shape of the
 *   ExperimentGroupsType object in our GraphQL schema.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const logUserExperimentGroups = async (userContext, userId, experimentGroups = {}) => {
  var returnedUser

  // If there are no experiment groups to update, simply get and
  // return the user.
  if (isEmpty(experimentGroups)) {
    try {
      returnedUser = await UserModel.get(userContext, userId)
    } catch (e) {
      throw e
    }
    return returnedUser
  }

  const validatedGroups = getValidatedExperimentGroups(experimentGroups)

  // Unpack and conditionally update experiment groups. Only do this
  // for experiment groups that the client assigns, because the client
  // can modify these data.
  const userDataToUpdate = Object.assign(
    {
      id: userId
    },
    // Active experiment groups
    !isNil(validatedGroups.oneAdForNewUsers) ? {
      testOneAdForNewUsers: validatedGroups.oneAdForNewUsers
    }
      : null,
    !isNil(validatedGroups.adExplanation) ? {
      testAdExplanation: validatedGroups.adExplanation
    }
      : null
  )
  try {
    returnedUser = await UserModel.update(userContext, userDataToUpdate)
  } catch (e) {
    throw e
  }
  return returnedUser
}

export default logUserExperimentGroups
