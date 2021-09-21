import { USER_BACKGROUND_OPTION_DAILY } from '../constants'
import setBackgroundImage from './setBackgroundImage'

const DEPRECATED_IMG_IDS = ['9308b921-44c7-4b4e-845d-3b01fa73fa2b']
const REPLACEMENT_IMG_ID = '7e73d6d7-b915-4366-b01a-ffc126466d5b'

/**
 * A resolver for the user's background image.
 * @param {Object} userContext - The user authorizer object.
 * @param {Object} user
 * @param {String} user.id - the user's ID
 * @param {String} user.backgroundImage - the current value of
 *   the User model's backgroundOption field
 * @param {Object} user.backgroundImage - the current value of
 *   the User model's backgroundImage field
 * @return {Promise<Object>}  A promise that resolves into a
 *   backgroundImage value.
 */
const getBackgroundImage = async (
  userContext,
  { id, backgroundOption, backgroundImage = {} }
) => {
  // We might remove images from time to time, and rather than
  // run a one-off script to update users, handle it here.
  // If the user's current image is deprecated, update it.
  if (DEPRECATED_IMG_IDS.indexOf(backgroundImage.id) > -1) {
    const mode = backgroundOption || USER_BACKGROUND_OPTION_DAILY
    const updatedUser = await setBackgroundImage(
      userContext,
      id,
      REPLACEMENT_IMG_ID,
      mode
    )
    return updatedUser.backgroundImage
  }
  return backgroundImage
}

export default getBackgroundImage
