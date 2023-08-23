import { v4 as uuid } from 'uuid'
import UserGroupImpactMetric from './UserGroupImpactMetricModel'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'
import {
  GROUP_IMPACT_OVERRIDE,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'
import {
  getEstimatedMoneyRaisedPerTab,
  getEstimatedMoneyRaisedPerSearch,
} from '../globals/globals'
import UserModel from '../users/UserModel'
import GroupImpactLeaderboard from './GroupImpactLeaderboard'

const groupImpactOverride = getPermissionsOverride(GROUP_IMPACT_OVERRIDE)

const replaceUserGroupImpactMetricModel = async (
  userContext,
  userId,
  groupImpactMetricId,
  oldUserGroupImpactMetricId = null,
  tabDollarContribution = 0,
  searchDollarContribution = 0,
  referralDollarContribution = 0
) => {
  const userGroupImpactMetric = await UserGroupImpactMetric.create(
    groupImpactOverride,
    {
      id: uuid(),
      userId,
      groupImpactMetricId,
      dollarContribution:
        tabDollarContribution +
        searchDollarContribution +
        referralDollarContribution,
      tabDollarContribution,
      searchDollarContribution,
      referralDollarContribution,
    }
  )
  if (oldUserGroupImpactMetricId !== null) {
    await UserGroupImpactMetric.delete(oldUserGroupImpactMetricId)
  }

  await UserModel.update(userContext, {
    id: userId,
    userGroupImpactMetricId: userGroupImpactMetric.id,
  })
  return userGroupImpactMetric
}

const updateUserGroupImpactMetricModel = async (
  id,
  dollarContribution,
  tabDollarContribution,
  searchDollarContribution,
  referralDollarContribution
) => {
  return UserGroupImpactMetric.update(groupImpactOverride, {
    id,
    dollarContribution,
    tabDollarContribution,
    searchDollarContribution,
    referralDollarContribution,
  })
}

const updateUserGroupImpactMetric = async (
  userContext,
  user,
  groupImpactMetric,
  source
) => {
  if (!source) {
    throw new Error('Update Source Required')
  }
  // Fetch current UserGroupImpactMetric entry, create if does not exist
  let userGroupImpactMetric
  if (!('userGroupImpactMetricId' in user)) {
    userGroupImpactMetric = await replaceUserGroupImpactMetricModel(
      userContext,
      user.id,
      groupImpactMetric.id
    )
  } else {
    try {
      userGroupImpactMetric = await UserGroupImpactMetric.get(
        userContext,
        user.userGroupImpactMetricId
      )
    } catch (e) {
      if (e.code === DatabaseItemDoesNotExistException.code) {
        // Get the impact metric ID here
        userGroupImpactMetric = await replaceUserGroupImpactMetricModel(
          userContext,
          user.id,
          groupImpactMetric.id
        )
      } else {
        throw e
      }
    }
  }

  const microUSDsForTab = 10 ** 6 * getEstimatedMoneyRaisedPerTab()
  const microUSDsForSearch = 10 ** 6 * getEstimatedMoneyRaisedPerSearch()
  const microUSDsForReferral = 10 ** 6 // TODO: make into a config
  if (groupImpactMetric.id !== userGroupImpactMetric.groupImpactMetricId) {
    // Create new UserGroupImpactMetric model and update leaderboard
    let userGroupImpactMetricModel
    if (source === 'tab') {
      userGroupImpactMetricModel = await replaceUserGroupImpactMetricModel(
        userContext,
        user.id,
        groupImpactMetric.id,
        userGroupImpactMetric.id,
        Math.round(microUSDsForTab)
      )
    } else if (source === 'search') {
      userGroupImpactMetricModel = await replaceUserGroupImpactMetricModel(
        userContext,
        user.id,
        groupImpactMetric.id,
        userGroupImpactMetric.id,
        0,
        Math.round(microUSDsForSearch)
      )
    } else if (source === 'referral') {
      userGroupImpactMetricModel = await replaceUserGroupImpactMetricModel(
        userContext,
        user.id,
        groupImpactMetric.id,
        userGroupImpactMetric.id,
        0,
        0,
        Math.round(microUSDsForReferral)
      )
    }
    GroupImpactLeaderboard.add(
      groupImpactMetric.id,
      user.id,
      userGroupImpactMetricModel.dollarContribution
    )
    return userGroupImpactMetricModel
  }
  let newDollarProgress
  let newTabDollarProgress
  let newSearchDollarProgress
  let newReferralDollarProgress
  if (source === 'tab') {
    newTabDollarProgress = Math.round(
      userGroupImpactMetric.tabDollarContribution
        ? userGroupImpactMetric.tabDollarContribution + microUSDsForTab
        : microUSDsForTab
    )
    newSearchDollarProgress = userGroupImpactMetric.searchDollarContribution
      ? userGroupImpactMetric.searchDollarContribution
      : 0
    newReferralDollarProgress = userGroupImpactMetric.referralDollarContribution
      ? userGroupImpactMetric.referralDollarContribution
      : 0
    newDollarProgress = Math.round(
      userGroupImpactMetric.dollarContribution + microUSDsForTab
    )
  } else if (source === 'search') {
    newTabDollarProgress = userGroupImpactMetric.tabDollarContribution
      ? userGroupImpactMetric.tabDollarContribution
      : 0
    newSearchDollarProgress = Math.round(
      userGroupImpactMetric.searchDollarContribution
        ? userGroupImpactMetric.searchDollarContribution + microUSDsForSearch
        : microUSDsForSearch
    )
    newReferralDollarProgress = userGroupImpactMetric.referralDollarContribution
      ? userGroupImpactMetric.referralDollarContribution
      : 0
    newDollarProgress = Math.round(
      userGroupImpactMetric.dollarContribution + microUSDsForSearch
    )
  } else if (source === 'referral') {
    newTabDollarProgress = userGroupImpactMetric.tabDollarContribution
      ? userGroupImpactMetric.tabDollarContribution
      : 0
    newSearchDollarProgress = userGroupImpactMetric.searchDollarContribution
      ? userGroupImpactMetric.searchDollarContribution
      : 0
    newReferralDollarProgress = userGroupImpactMetric.referralDollarContribution
      ? userGroupImpactMetric.referralDollarContribution + microUSDsForReferral
      : microUSDsForReferral
    newDollarProgress = Math.round(
      userGroupImpactMetric.dollarContribution + microUSDsForReferral
    )
  }
  GroupImpactLeaderboard.add(groupImpactMetric.id, user.id, newDollarProgress)
  return updateUserGroupImpactMetricModel(
    userGroupImpactMetric.id,
    newDollarProgress,
    newTabDollarProgress,
    newSearchDollarProgress,
    newReferralDollarProgress
  )
}

export default updateUserGroupImpactMetric
