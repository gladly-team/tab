
import moment from 'moment'
import UserModel from './UserModel'
import {
  getRandomImage
} from '../backgroundImages/backgroundImage'
import {
  USER_BACKGROUND_OPTION_DAILY
} from '../constants'

/**
 * Set user's background image to change daily.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const setBackgroundImageDaily = async (userContext, userId) => {
  const image = await getRandomImage()
  image.timestamp = moment.utc().toISOString()
  const userInstance = await UserModel.update(userContext, {
    id: userId,
    backgroundImage: image,
    backgroundOption: USER_BACKGROUND_OPTION_DAILY
  })
  return userInstance
}

export default setBackgroundImageDaily
