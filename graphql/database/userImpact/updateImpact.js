import UserImpactModel from './UserImpactModel'
import { USER_VISIT_IMPACT_VALUE } from '../constants'
/**
 * updates a user impact record
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} tabId - A UUID for this opened tab
 * @param {object} updates - options to update impact record, include logImpact, claimPendingReferralImpact, confirmImpact
 * @return {Promise<User>}  A promise that resolves into a UserImpact instance.
 */

const updateImpact = async (userContext, userId, charityId, updates) => {
  let userImpact = await UserImpactModel.get(userContext, userId, charityId)
  const { logImpact, claimPendingReferralImpact, confirmImpact } = updates
  let {
    userImpactMetric,
    pendingUserReferralImpact,
    visitsUntilNextImpact,
    confirmedImpact,
  } = userImpact
  // when user opens a new tab decrement visits counter and reset when
  // remaining visits hits 0
  if (logImpact && confirmedImpact) {
    if (visitsUntilNextImpact > 1) {
      visitsUntilNextImpact -= 1
    } else {
      visitsUntilNextImpact = USER_VISIT_IMPACT_VALUE
      userImpactMetric += 1
    }
  }
  // if a user claims a referral reward give them all impact bonuses
  // currently pending and reset the counter.
  if (claimPendingReferralImpact) {
    userImpactMetric += pendingUserReferralImpact
    pendingUserReferralImpact = 0
  }
  // if a user confirms enable impact and give them first visit.
  if (confirmImpact) {
    confirmedImpact = confirmImpact
    visitsUntilNextImpact -= 1
  }
  userImpact = await UserImpactModel.update(userContext, {
    ...userImpact,
    userImpactMetric,
    pendingUserReferralImpact,
    visitsUntilNextImpact,
    confirmedImpact,
  })
  return userImpact
}

export default updateImpact
