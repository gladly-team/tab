
import moment from 'moment'
import { filter } from 'lodash/collection'

import ReferralDataModel from './ReferralDataModel'

/**
 * Get an array of a user's recruits.
 * @param {object} userContext - The user authorizer object.
 * @param {string} referringUserId - The user id of the referrer.
 * @return {Promise<Object[]>} recruits - A list of objects, each of
 *   which contains information about a recruited user.
 * @param {string} recruits.recruitedAt - The ISO timestamp of when
 *   the recruited user joined
 * @param {string|null} recruits.lastActive - The ISO timestamp of when
 *   the recruited user last opened a tab. If null, the user never
 *   opened a tab.
 */
export const getRecruits = async (userContext, referringUserId, startTime = null, endTime = null) => {
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
      lastActive: '2017-08-22T07:40:01Z'
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
 * @param {string|null} recruitsEdges.node.lastActive - The ISO timestamp of when
 *   the recruited user last opened a tab
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
 * @param {Object[]} recruitsEdges - An array of edges returned by
 *   the `getRecruits` query.
 * @param {string} recruitsEdges.cursor - The edge's GraphQL cursor
 * @param {Object} recruitsEdges.node - The GraphQL node
 * @param {string} recruitsEdges.node.recruitedAt - The ISO timestamp of
 *   when the recruited user joined
 * @param {string|null} recruitsEdges.node.lastActive - The ISO timestamp of when
 *   the recruited user last opened a tab
 * @return {integer} The number of recruits in the returned set who
 *   were active for at least one day.
 */
export const getRecruitsActiveForAtLeastOneDay = (recruitsEdges) => {
  if (!recruitsEdges) {
    return 0
  }
  return filter(recruitsEdges, (recruitEdge) => {
    if (!recruitEdge.node.lastActive) {
      return false
    }
    // true if "lastActive" is >1 day after "recruitedAt"
    return (
      moment(recruitEdge.node.lastActive).diff(
        moment(recruitEdge.node.recruitedAt), 'seconds') >=
      86400
    )
  }).length
}

export default getRecruits
