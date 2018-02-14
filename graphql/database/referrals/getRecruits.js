
import moment from 'moment'
import { filter } from 'lodash/collection'

import { isValidISOString } from '../../utils/utils'
import ReferralDataModel from './ReferralDataModel'
import UserModel from '../users/UserModel'
import {
  getPermissionsOverride,
  GET_RECRUITS_LAST_ACTIVE_OVERRIDE
} from '../../utils/permissions-overrides'
const getRecruitsOverride = getPermissionsOverride(GET_RECRUITS_LAST_ACTIVE_OVERRIDE)

/**
 * Get an array of a user's recruits.
 * @param {object} userContext - The user authorizer object.
 * @param {string} referringUserId - The user id of the referrer.
 * @param {string} startTime - An ISO string of the earliest referral datetime
 *   to filter on
 * @param {string} endTime - An ISO string of the latest referral datetime
 *   to filter on
 * @return {Promise<Object[]>} recruits - A list of objects, each of
 *   which contains information about a recruited user.
 * @return {string} recruit.recruitedAt - The ISO timestamp of
 *   when the recruited user joined
 * @return {string|null} recruit.lastActive - The ISO timestamp of when
 *   the recruited user last opened a tab
 */
export const getRecruits = async (userContext, referringUserId, startTime = null, endTime = null) => {
  // Build the basic query
  var refLogsQuery = ReferralDataModel.query(userContext, referringUserId)
    .usingIndex('ReferralsByReferrer')

  // Validate startTime and/or endTime, if provided
  if (startTime && !isValidISOString(startTime)) {
    throw new Error('Invalid `startTime` argument. It must be an ISO string.')
  }
  if (endTime && !isValidISOString(endTime)) {
    throw new Error('Invalid `endTime` argument. It must be an ISO string.')
  }

  // Filter by startTime and/or endTime, if provided
  if (startTime && endTime) {
    refLogsQuery.where('created').between(startTime, endTime)
  } else if (startTime) {
    refLogsQuery.where('created').gte(startTime)
  } else if (endTime) {
    refLogsQuery.where('created').lte(endTime)
  }

  // Execute the final query
  const referralLogs = await refLogsQuery.execute()

  // The user has no recruits
  if (referralLogs.length === 0) {
    return []
  }

  // Batch-get times of last tab opened for recruits of shape:
  // [{ userId: 'timeOfLastTab' }]
  const recruitsLastActiveTimes = await UserModel.getBatch(getRecruitsOverride,
    referralLogs.map(recruit => recruit.userId) // array of recruits' user IDs
  ).then((recruits) => {
    let recruitsLastActiveMap = {}
    recruits.forEach((user) => {
      recruitsLastActiveMap[user.id] = user.lastTabTimestamp || null
    })
    return recruitsLastActiveMap
  })

  const recruitData = []
  referralLogs.forEach((referralLog) => {
    // Do not include any sensitive user data about recruits, because
    // this data is visible to the referrer.
    recruitData.push({
      recruitedAt: referralLog.created,
      lastActive: recruitsLastActiveTimes[referralLog.userId] || null
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
