import UserImpactModel from './UserImpactModel'
import { USER_VISIT_IMPACT_VALUE } from '../constants'
/**
 * updates a user impact record
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} charityId - A UUID for the charity
 * @param {object} updates - options to update impact record, include logImpact, claimPendingUserReferralImpact, confirmImpact
 * @return {Promise<User>}  A promise that resolves into a UserImpact instance.
 */
const shouldShowImpactNotification = userImpactMetric => {
  const impactCountsToShow = [1, 3, 5, 7, 10, 15]
  return !(
    impactCountsToShow.includes(userImpactMetric) ||
    (userImpactMetric >= 20 && userImpactMetric % 10 === 0)
  )
}
const updateImpact = async (userContext, userId, charityId, updates) => {
  let userImpact = await UserImpactModel.get(userContext, userId, charityId)
  const {
    logImpact,
    claimPendingUserReferralImpact,
    confirmImpact,
    claimLatestReward,
  } = updates
  let {
    userImpactMetric,
    pendingUserReferralImpact,
    pendingUserReferralCount,
    visitsUntilNextImpact,
    confirmedImpact,
    hasClaimedLatestReward,
  } = userImpact

  // when user opens a new tab decrement visits counter and reset when
  // remaining visits hits 0
  if (logImpact && confirmedImpact) {
    if (visitsUntilNextImpact > 1) {
      visitsUntilNextImpact -= 1
    } else {
      visitsUntilNextImpact = USER_VISIT_IMPACT_VALUE
      userImpactMetric += 1
      hasClaimedLatestReward = !hasClaimedLatestReward
        ? false
        : shouldShowImpactNotification(userImpactMetric)
    }
  }
  // if a user claims a referral reward give them all impact bonuses
  // currently pending and reset the counter.
  if (claimPendingUserReferralImpact) {
    userImpactMetric += pendingUserReferralImpact
    pendingUserReferralImpact = 0
    pendingUserReferralCount = 0
  }
  // if a user confirms enable impact and give them first visit.
  if (confirmImpact) {
    confirmedImpact = confirmImpact
  }
  // if a user celebrates the latest reward on the front end
  if (claimLatestReward) {
    hasClaimedLatestReward = claimLatestReward
  }

  userImpact = await UserImpactModel.update(userContext, {
    ...userImpact,
    userImpactMetric,
    pendingUserReferralCount,
    pendingUserReferralImpact,
    visitsUntilNextImpact,
    confirmedImpact,
    hasClaimedLatestReward,
  })
  return userImpact
}

export default updateImpact
