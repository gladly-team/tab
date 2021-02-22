import UserImpactModel from './UserImpactModel'
import USER_VISIT_IMPACT_VALUE from '../constants'
/**
 * Change the user's tab and VC stats accordingly when the
 * user opens a tab.
 * This only increments the VC if the tab is "valid",
 * which prevents "fradulent" tab spamming.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} tabId - A UUID for this opened tab
 * @param {object} updates - options to update impact record
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */

const updateImpact = async (userContext, userId, charityId, updates) => {
  // Check if it's a valid tab before incrementing user VC or
  // the user's valid tab count.
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
