import { User } from './base'
import { getNextLevelFor } from '../userLevels/userLevel'
import { UserReachedMaxLevelException } from '../../utils/exceptions'
import { logger } from '../../utils/dev-tools'
import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
import moment from 'moment'
/**
 * Updates the user Vc by adding the specified vc. Note that
 * vc can be negative so the user vcCurrent will be decreased by
 * that amount.
 * Also updates the user level if requiered.
 * @param {string} id - The user id.
 * @param {number} vc - The user all time vc.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
var updateUserVc = Async(function (id, vc = 0, updateTimestamp = false) {
  var updateExpression
  var expressionAttributeValues
  if (vc > 0) {
    updateExpression = {
      add: ['vcCurrent :val', 'vcAllTime :val', 'heartsUntilNextLevel :subval']
    }

    expressionAttributeValues = {
      ':val': vc,
      ':subval': -vc
    }

    if (updateTimestamp) {
      updateExpression['set'] = ['lastTabTimestamp = :lastTabTimestamp']
      expressionAttributeValues[':lastTabTimestamp'] = moment.utc().format()
    }
  } else {
      // TODO(raul): Look how to accomplish something like
      //  set vcCurrent = max(vcCurrent + :val, 0)
    updateExpression = {
      set: ['vcCurrent = vcCurrent + :val']
    }

    expressionAttributeValues = {
      ':val': vc
    }

    if (updateTimestamp) {
      updateExpression['set'].push('lastTabTimestamp = :lastTabTimestamp')
      expressionAttributeValues[':lastTabTimestamp'] = moment.utc().format()
    }
  }

  var params = {
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }

  const user = Await(User.update(id, updateExpression, params))

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
  const updateExpression = {
    set: [
      '#lvl = :level',
      'heartsUntilNextLevel = :nextLevelHearts'
    ]
  }

  const params = {
    ExpressionAttributeNames: {
      '#lvl': 'level'
    },
    ExpressionAttributeValues: {
      ':level': userLevel,
      ':nextLevelHearts': level.hearts - user.vcAllTime
    },
    ReturnValues: 'ALL_NEW'
  }

  return User.update(user.id, updateExpression, params)
            .then(updatedUser => updatedUser)
            .catch(err => {
              logger.error('Error while updating user.', err)
            })
}

/**
 * Increments the user vc by 1 only. Implements fraud protection by
 * only allowing the increment if 2 seconds has passed from the previous one.
 * @param {string} id - The user id.
 * @return {Promise<User>}  A promise that resolve into a User instance.
 */
var incrementVcBy1 = Async(function (id) {
  const user = Await(User.get(id))
  const now = moment.utc()
  var lastTabTimestamp = user.lastTabTimestamp ? moment.utc(user.lastTabTimestamp) : null
  if (!lastTabTimestamp || now.diff(lastTabTimestamp, 'seconds') > 2) {
    return Await(updateUserVc(id, 1, true))
  }
  return user
})

export {
  updateUserVc,
  incrementVcBy1
}
