import moment from 'moment'
import UserModel from './UserModel'
import getCause from '../cause/getCause'
import getRandomBackgroundImage from '../backgroundImages/getRandomBackgroundImage'
import {
  USER_BACKGROUND_OPTION_DAILY,
  BACKGROUND_IMAGE_LEGACY_CATEGORY,
} from '../constants'

/**
 * Set user's background image to change daily.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const setBackgroundImageDaily = async (userContext, userId) => {
  try {
    const user = await UserModel.get(userContext, userId)
    let category = BACKGROUND_IMAGE_LEGACY_CATEGORY
    if (user.v4BetaEnabled) {
      const { backgroundImageCategory } = await getCause(user.causeId)
      category = backgroundImageCategory
    }
    const image = await getRandomBackgroundImage(userContext, category)
    const userInstance = await UserModel.update(userContext, {
      id: userId,
      backgroundImage: {
        id: image.id,
        image: image.image,
        timestamp: moment.utc().toISOString(),
      },
      backgroundOption: USER_BACKGROUND_OPTION_DAILY,
    })
    return userInstance
  } catch (e) {
    throw e
  }
}

export default setBackgroundImageDaily
