import moment from 'moment'

/**
 * Generate a filter function to exclude users who joined less than
 * X time units ago.
 * @param {Object} userInfo
 * @param {String} userInfo.joined - The ISO string of when the
 *   user joined.
 * @param {Boolean} userInfo.isNewUser - Whether this user has just
 *   signed up.
 * @returns {Function}
 */
export const excludeUsersWhoJoinedWithin = (number, units = 'days') => {
  return userInfo => moment().diff(moment(userInfo.joined), units) > number
}

/**
 * A filter to only include new users.
 * @param {Object} userInfo
 * @param {String} userInfo.joined - The ISO string of when the
 *   user joined.
 * @param {Boolean} userInfo.isNewUser - Whether this user has just
 *   signed up.
 * @returns {Boolean}
 */
export const onlyIncludeNewUsers = userInfo => !!userInfo.isNewUser

/**
 * A meta filter function to allow for "or" logic. If at least
 * one of the included filters returns true, this filter will
 * return true.
 * @param {Function[]} An array of filter functions
 * @returns {Function}
 */
export const includeIfAnyIsTrue = filterFuncs => {
  return userInfo => {
    return filterFuncs.some(filterFunc => filterFunc(userInfo))
  }
}
