
import moment from 'moment'
import UserModel from './UserModel'
import {
  USER_BACKGROUND_OPTION_PHOTO
} from '../constants'
import {
  getBackgroundImage
} from '../backgroundImages/backgroundImage'

/**
 * Set user's background image.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} imageId - The image id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const setBackgroundImage = async (userContext, userId, imageId, mode) => {
  const image = await getBackgroundImage(imageId)
  image.timestamp = moment.utc().format()
  if (!mode) {
    mode = USER_BACKGROUND_OPTION_PHOTO
  }
  const userInstance = await UserModel.update(userContext, {
    id: userId,
    backgroundImage: image,
    backgroundOption: mode
  })
  return userInstance
}

export default setBackgroundImage
