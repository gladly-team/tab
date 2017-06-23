import { User } from './base'
import { getNextLevelFor } from '../userLevels/userLevel'
import { UserReachedMaxLevelException } from '../../utils/exceptions'
import { logger } from '../../utils/dev-tools'
import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
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

export {
  updateUserVc
}
