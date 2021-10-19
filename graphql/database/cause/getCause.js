import { find } from 'lodash/collection'
import UserModel from '../users/UserModel'
import causes from './causes'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'

/**
 * Get a cause record based on user record
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a Cause instance.
 */

const getCause = async (userContext, userId) => {
  const user = await UserModel.get(userContext, userId)
  const cause = find(causes, { id: user.causeId })
  if (!cause) {
    throw new DatabaseItemDoesNotExistException()
  }
  return cause
}

export default getCause
