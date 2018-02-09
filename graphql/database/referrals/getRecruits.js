
import { filter } from 'lodash/collection'

/**
 * Get an array of a user's recruits.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<Object[]>}  Returns a list of objects, each of
 *   which contains information about a recruited user.
 */
const getRecruits = async (userContext, userId, startTime = null, endTime = null) => {
  // TODO: implement
  // TODO: replace 'activeForAtLeastOneDay' with the more flexible 'lastActive'
  return [
    {
      recruitedAt: '2017-05-19T13:59:46.000Z',
      activeForAtLeastOneDay: true
    },
    {
      recruitedAt: '2017-02-07T13:59:46.000Z',
      activeForAtLeastOneDay: false
    },
    {
      recruitedAt: '2017-02-07T17:69:46.000Z',
      activeForAtLeastOneDay: false
    }
  ]
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
