import {
  USER_BACKGROUND_OPTION_DAILY,
  BACKGROUND_IMAGE_LEGACY_CATEGORY,
} from '../constants'
import setBackgroundImage from './setBackgroundImage'
import setBackgroundImageDaily from './setBackgroundImageDaily'

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
  { id, backgroundOption, v4BetaEnabled, backgroundImage }
) => {
  // we've moved creating the first background Image for v4 users to this resolver
  // we return a legacy image by default.  Update it if it's legacy.
  // when a user switches causes we'll need to update their background image for that day
  if (
    v4BetaEnabled &&
    backgroundImage.category === BACKGROUND_IMAGE_LEGACY_CATEGORY
  ) {
    const updatedUser = await setBackgroundImageDaily(userContext, id)
    return updatedUser.backgroundImage
  }
  if (DEPRECATED_IMG_IDS.indexOf(backgroundImage.id) > -1) {
    // We might remove images from time to time, and rather than
    // run a one-off script to update users, handle it here.
    // If the user's current image is deprecated, update it.
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
