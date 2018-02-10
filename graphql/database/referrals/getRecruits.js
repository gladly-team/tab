
import { filter } from 'lodash/collection'

import ReferralDataModel from './ReferralDataModel'

/**
 * Get an array of a user's recruits.
 * @param {object} userContext - The user authorizer object.
 * @param {string} referringUserId - The user id of the referrer.
 * @return {Promise<Object[]>}  Returns a list of objects, each of
 *   which contains information about a recruited user.
 */
export const getRecruits = async (userContext, referringUserId, startTime = null, endTime = null) => {
  // TODO: replace 'activeForAtLeastOneDay' with the more flexible 'lastActive'
  const referralLogs = await ReferralDataModel.query(userContext, referringUserId)
    .usingIndex('ReferralsByReferrer')
    .execute()

  // TODO
  // Batch-get times of last tab opened for recruits
  // const recruitsLastActiveTimes = {}

  const recruitData = []
  referralLogs.forEach((referralLog) => {
    // Do not include any sensitive user data about recruits, because
    // this data is visible to the referrer.
    recruitData.push({
      recruitedAt: referralLog.created,
      // TODO: look up from recruitsLastActiveTimes
      activeForAtLeastOneDay: true
    })
  })
  return recruitData
}

/**
 * Get the count of recruits returned from the `getRecruits` query.
 * @param {Object[]} recruitsEdges - The an array of edges returned by
 *   the `getRecruits` query.
 * @param {string} recruitsEdges.cursor - The edge's GraphQL cursor
 * @param {Object} recruitsEdges.node - The GraphQL node
 * @param {string} recruitsEdges.node.recruitedAt - The ISO timestamp of
 *   when the recruited user joined
 * @param {boolean} recruitsEdges.node.activeForAtLeastOneDay - Whether
 *   the recruited user was an active user for at least one day after
 *   joining.
 * @return {integer} The total number of recruits in the returned set.
 */
export const getTotalRecruitsCount = (recruitsEdges) => {
  if (!recruitsEdges) {
    return 0
  }
  return recruitsEdges.length
}

/**
 * Get the count of recruits returned from the `getRecruits` query
 *   who remained active for at least one day after joining.
 * @param {Object[]} recruitsEdges - The an array of edges returned by
 *   the `getRecruits` query.
 * @param {string} recruitsEdges.cursor - The edge's GraphQL cursor
 * @param {Object} recruitsEdges.node - The GraphQL node
 * @param {string} recruitsEdges.node.recruitedAt - The ISO timestamp of
 *   when the recruited user joined
 * @param {boolean} recruitsEdges.node.activeForAtLeastOneDay - Whether
 *   the recruited user was an active user for at least one day after
 *   joining.

 * @return {integer} The number of recruits in the returned set who
 *   were active for at least one day.
 */
export const getRecruitsActiveForAtLeastOneDay = (recruitsEdges) => {
  if (!recruitsEdges) {
    return 0
  }
  return filter(recruitsEdges, 'node.activeForAtLeastOneDay').length
}

export default getRecruits
