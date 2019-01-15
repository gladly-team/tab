import UserModel from './UserModel'
import { USER_BACKGROUND_OPTION_CUSTOM } from '../constants'

/**
 * Set user's background image from a custom image URL.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} imageUrl - The url for the image to use as background.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const setBackgroundImageFromCustomURL = async (
  userContext,
  userId,
  imageURL
) => {
  try {
    const userInstance = await UserModel.update(userContext, {
      id: userId,
      customImage: imageURL,
      backgroundOption: USER_BACKGROUND_OPTION_CUSTOM,
    })
    return userInstance
  } catch (e) {
    throw e
  }
}

export default setBackgroundImageFromCustomURL
