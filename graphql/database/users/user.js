import BaseModel from '../base/model'
import tablesNames from '../tables'
import { getNextLevelFor } from '../userLevels/userLevel'
import { logReferralData } from '../referrals/referralData'
import { getBackgroundImage, getRandomImage } from '../backgroundImages/backgroundImage'
import { UserReachedMaxLevelException } from '../../utils/exceptions'
import { logger } from '../../utils/dev-tools'

import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
import moment from 'moment'

/*
 * Represents a User.
 * @extends BaseModel
 */
class User extends BaseModel {
  /**
   * Creates a User instance.
   * @param {string} id - The instance id in the database.
   */
  constructor (id) {
    super(id)

    this.username = null
    this.email = ''
    this.vcCurrent = 0
    this.vcAllTime = 0
    this.level = 1

    // This value needs to match the hearts requiered for lv2 in DB.
    this.heartsUntilNextLevel = 5

    this.backgroundImage = {
      id: 'fb5082cc-151a-4a9a-9289-06906670fd4e',
      name: 'Mountain Lake',
      fileName: 'lake.jpg',
      timestamp: moment.utc().format()
    }

    this.backgroundOption = User.BACKGROUND_OPTION_PHOTO
    this.customImage = null
    this.backgroundColor = null
    this.activeWidget = null
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName () {
    return tablesNames.users
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields () {
    return [
      'username',
      'email',
      'vcCurrent',
      'vcAllTime',
      'level',
      'heartsUntilNextLevel',
      'backgroundImage',
      'backgroundOption',
      'customImage',
      'backgroundColor',
      'activeWidget'
    ]
  }
}

User.BACKGROUND_OPTION_DAILY = 'daily'
User.BACKGROUND_OPTION_CUSTOM = 'custom'
User.BACKGROUND_OPTION_COLOR = 'color'
User.BACKGROUND_OPTION_PHOTO = 'photo'

/**
 * Creates a new user.
 * @param {Object<User>} user - The user instance.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
var createUser = Async(function (user, referralData) {
  Await(User.add(user))
  if (referralData) {
    Await(logReferralData(user.id, referralData))
  }
  return user
})

/**
 * Fetch the user by id.
 * @param {string} id - The user id.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
function getUser (id) {
  return User.get(id)
            .then(user => user)
            .catch(err => {
              logger.error('Error while getting the user.', err)
            })
}

/**
 * Set user background image.
 * @param {string} userId - The user id.
 * @param {string} imageId - The image id.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
var setUserBackgroundImage = Async(function (userId, imageId, mode) {
  const image = Await(getBackgroundImage(imageId))
  image.timestamp = moment.utc().format()
  const user = Await(_setUserBackgroundImage(userId, image, mode))
  return user
})

var _setUserBackgroundImage = Async(function (userId, image, mode) {
  if (!mode) {
    mode = User.BACKGROUND_OPTION_PHOTO
  }

  var updateExpression = `SET #backgroundImage = :backgroundImage,
    #backgroundOption = :backgroundOption`
  var expressionAttributeNames = {
    '#backgroundImage': 'backgroundImage',
    '#backgroundOption': 'backgroundOption'
  }
  var expressionAttributeValues = {
    ':backgroundImage': image,
    ':backgroundOption': mode
  }

  var params = {
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }

  const user = Await(User.update(userId, params))
  return user
})

/**
 * Updates the user Vc by adding the specified vc. Note that
 * vc can be negative so the user vcCurrent will be decreased by
 * that amount.
 * Also updates the user level if requiered.
 * @param {string} id - The user id.
 * @param {number} vc - The user all time vc.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
var updateUserVc = Async(function (id, vc = 0) {
  var updateExpression
  var expressionAttributeValues
  if (vc > 0) {
    updateExpression = `add vcCurrent :val, 
                          vcAllTime :val, 
                          heartsUntilNextLevel :subval`
    expressionAttributeValues = {
      ':val': vc,
      ':subval': -vc
    }
  } else {
      // TODO(raul): Look how to accomplish something like
      //  set vcCurrent = max(vcCurrent + :val, 0)
    updateExpression = 'set vcCurrent = vcCurrent + :val'
    expressionAttributeValues = {
      ':val': vc
    }
  }

  var params = {
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }

  const user = Await(User.update(id, params))

  if (vc > 0 && user.heartsUntilNextLevel <= 0) {
    const level = Await(getNextLevelFor(user.level + 1, user.vcAllTime))
    if (level) {
      const updatedUser = Await(updateFromNextLevel(level, user))
      return updatedUser
    }
    throw new UserReachedMaxLevelException()
  }
  return user
})

/**
 * Updates the user level and the heartsUntilNextLevel
 * from the level specified.
 * @param {UserLevel} level - The next level for this user.
 * @param {User} user - The user.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
function updateFromNextLevel (level, user) {
  const userLevel = level.id - 1
  // Update user to userLevel.
  const updateExpression = `set #lvl = :level, 
                  heartsUntilNextLevel = :nextLevelHearts`
  const params = {
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: {
      '#lvl': 'level'
    },
    ExpressionAttributeValues: {
      ':level': userLevel,
      ':nextLevelHearts': level.hearts - user.vcAllTime
    },
    ReturnValues: 'ALL_NEW'
  }

  return User.update(user.id, params)
            .then(updatedUser => updatedUser)
            .catch(err => {
              logger.error('Error while updating user.', err)
            })
}

/**
 * Set user background color.
 * @param {string} userId - The user id.
 * @param {string} color - The background color.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
var setUserBackgroundColor = Async(function (userId, color) {
  var updateExpression = `SET #backgroundColor = :backgroundColor,
    #backgroundOption = :backgroundOption`
  var expressionAttributeNames = {
    '#backgroundColor': 'backgroundColor',
    '#backgroundOption': 'backgroundOption'
  }
  var expressionAttributeValues = {
    ':backgroundColor': color,
    ':backgroundOption': User.BACKGROUND_OPTION_COLOR
  }

  var params = {
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }

  const user = Await(User.update(userId, params))
  return user
})

/**
 * Set user background from custom url.
 * @param {string} userId - The user id.
 * @param {string} imageUrl - The url for the image to use as background.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
var setUserBackgroundFromCustomUrl = Async(function (userId, imageUrl) {
  var updateExpression = `SET #customImage = :customImage,
    #backgroundOption = :backgroundOption`
  var expressionAttributeNames = {
    '#customImage': 'customImage',
    '#backgroundOption': 'backgroundOption'
  }
  var expressionAttributeValues = {
    ':customImage': imageUrl,
    ':backgroundOption': User.BACKGROUND_OPTION_CUSTOM
  }

  var params = {
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }

  const user = Await(User.update(userId, params))
  return user
})

/**
 * Set user background option to daily and updates the current background.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
var setUserBackgroundDaily = Async(function (userId) {
  const image = Await(getRandomImage())
  image.timestamp = moment.utc().format()
  const mode = User.BACKGROUND_OPTION_DAILY
  const user = Await(_setUserBackgroundImage(userId, image, mode))
  return user
})

/**
 * Set user active widget.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget Id.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
var setUserActiveWidget = Async(function (userId, widgetId) {
  var updateExpression = `SET #activeWidget = :activeWidget`
  var expressionAttributeNames = {
    '#activeWidget': 'activeWidget'
  }
  var expressionAttributeValues = {
    ':activeWidget': widgetId
  }

  var params = {
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }

  const user = Await(User.update(userId, params))
  return user
})

export {
  User,
  getUser,
  updateUserVc,
  setUserBackgroundImage,
  setUserBackgroundColor,
  setUserBackgroundFromCustomUrl,
  setUserBackgroundDaily,
  setUserActiveWidget,
  createUser
}
