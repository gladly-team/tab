import {
  USER_BACKGROUND_OPTION_DAILY,
  BACKGROUND_IMAGE_LEGACY_CATEGORY,
} from '../constants'
import setBackgroundImage from './setBackgroundImage'
import setBackgroundImageDaily from './setBackgroundImageDaily'
import {
  getPrivateBackgroundSignedUrl,
  getPublicBackgroundUrl,
} from '../../utils/s3'

const DEPRECATED_IMG_IDS = ['9308b921-44c7-4b4e-845d-3b01fa73fa2b']
const REPLACEMENT_IMG_ID = '7e73d6d7-b915-4366-b01a-ffc126466d5b'

/**
 * Handles background image resolution for users with the new backgroundConfig field.
 * Returns a backgroundImage-compatible object based on the config type, or null to
 * indicate the resolver should fall through to legacy logic.
 * @param {Object} backgroundConfig - The user's backgroundConfig object.
 * @returns {Object|null} A backgroundImage object with imageURL and timestamp,
 *   or null if legacy logic should be used.
 */
const resolveBackgroundConfig = (backgroundConfig) => {
  if (!backgroundConfig || !backgroundConfig.type) {
    return null
  }

  const { type, updatedAt } = backgroundConfig

  switch (type) {
    case 'daily':
      // Fall through to legacy code
      return null

    case 'color':
      // Color backgrounds don't need an image URL - return null to indicate no image
      return null

    case 'photo': {
      const { photo } = backgroundConfig
      if (!photo) {
        return null
      }
      return {
        id: photo,
        imageURL: getPublicBackgroundUrl(photo),
        timestamp: updatedAt,
      }
    }

    case 'custom': {
      const { customPhoto } = backgroundConfig
      if (!customPhoto || !customPhoto.path) {
        return null
      }
      return {
        id: customPhoto.path,
        imageURL: getPrivateBackgroundSignedUrl(customPhoto.path),
        timestamp: updatedAt,
      }
    }

    default:
      return null
  }
}

/**
 * A resolver for the user's background image.
 * @param {Object} userContext - The user authorizer object.
 * @param {Object} user
 * @param {String} user.id - the user's ID
 * @param {String} user.backgroundOption - the current value of
 *   the User model's backgroundOption field
 * @param {Object} user.backgroundImage - the current value of
 *   the User model's backgroundImage field
 * @param {Object} user.backgroundConfig - the new background configuration (if present)
 * @return {Promise<Object>}  A promise that resolves into a
 *   backgroundImage value.
 */
const getBackgroundImage = async (
  userContext,
  { id, backgroundOption, v4BetaEnabled, backgroundImage, backgroundConfig }
) => {
  // Check for new backgroundConfig first
  if (backgroundConfig) {
    const configResult = resolveBackgroundConfig(backgroundConfig)
    if (configResult !== null) {
      return configResult
    }
    // If configResult is null, fall through to legacy logic
    // (e.g., for 'daily' or 'color' types, or invalid configs)
  }

  // Legacy background image logic
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
