
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
export const excludeUsersWhoJoinedRecently = (number, units = 'days') => {
  return userInfo => moment().diff(moment(userInfo.joined), units) > number
}
