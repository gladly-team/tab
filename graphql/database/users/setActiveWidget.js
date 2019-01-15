import UserModel from './UserModel'

/**
 * Set the user's active widget.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget Id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const setActiveWidget = async (userContext, userId, widgetId) => {
  try {
    const userInstance = await UserModel.update(userContext, {
      id: userId,
      activeWidget: widgetId,
    })
    return userInstance
  } catch (e) {
    throw e
  }
}

export default setActiveWidget
