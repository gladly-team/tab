import moment from 'moment'
import { isEmpty, isNil } from 'lodash/lang'
import UserModel from './UserModel'

/**
 * Log actions the user takes in response to experiments.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user's ID.
 * @param {object|null} experimentActions - Any experimental test actions
 *   that take the shape of the ExperimentActionsType object in our GraphQL
 *   schema.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const logUserExperimentActions = async (
  userContext,
  userId,
  experimentActions = {}
) => {
  let returnedUser

  // If there are no experiment groups to update, simply get and
  // return the user.
  if (isEmpty(experimentActions)) {
    try {
      returnedUser = await UserModel.get(userContext, userId)
    } catch (e) {
      throw e
    }
    return returnedUser
  }

  // Unpack and conditionally update experiment actions.
  const userDataToUpdate = Object.assign(
    {
      id: userId,
    },
    // @experiment-search-intro
    !isNil(experimentActions.searchIntro)
      ? {
          testSearchIntroAction: experimentActions.searchIntro,
          testSearchIntroActionTime: moment.utc().toISOString(),
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

export default logUserExperimentActions
