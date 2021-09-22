import { nanoid } from 'nanoid'
import UserModel from './UserModel'
/**
 * A resolver for the user's background image.
 * @param {Object} userContext - The user authorizer object.
 * @param {Object} user.truexId - the user's truexId if it exists
 * @param {String} user.id - the user's ID
 * @param {Object} user.truexId - the current value of
 *   the User model's backgroundImage field
 * @return {Promise<Object>}  A promise that resolves into a
 *   truexId value.
 */
export default async (userContext, { truexId, id }) =>
  truexId ||
  (await UserModel.update(userContext, {
    id,
    truexId: nanoid(),
  })).truexId
