
import moment from 'moment'
import UserModel from './UserModel'
import getRandomBackgroundImage from '../backgroundImages/getRandomBackgroundImage'
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
  const image = await getRandomBackgroundImage(userContext)
  const userInstance = await UserModel.update(userContext, {
    id: userId,
    backgroundImage: {
      id: image.id,
      image: image.image,
      timestamp: moment.utc().toISOString()
    },
    backgroundOption: USER_BACKGROUND_OPTION_DAILY
  })
  return userInstance
}

export default setBackgroundImageDaily
