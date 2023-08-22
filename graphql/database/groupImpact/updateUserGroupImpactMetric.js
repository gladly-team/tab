import { v4 as uuid } from 'uuid'
import UserGroupImpactMetric from './UserGroupImpactMetricModel'
import UserGroupImpactMetricLogModel from './UserGroupImpactMetricLogModel'
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
  searchDollarContribution = 0
) => {
  const userGroupImpactMetric = await UserGroupImpactMetric.create(
    groupImpactOverride,
    {
      id: uuid(),
      userId,
      groupImpactMetricId,
      dollarContribution: tabDollarContribution + searchDollarContribution,
      tabDollarContribution,
      searchDollarContribution,
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
  searchDollarContribution
) => {
  return UserGroupImpactMetric.update(groupImpactOverride, {
    id,
    dollarContribution,
    tabDollarContribution,
    searchDollarContribution,
  })
}

const logUserGroupImpactMetricIfApplicable = async (
  groupImpactMetric,
  userGroupImpactMetric
) => {
  if (!groupImpactMetric.dateExpires) return

  const { dateStarted } = groupImpactMetric
  await UserGroupImpactMetricLogModel.create(groupImpactOverride, {
    ...userGroupImpactMetric,
    dateStarted,
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
  if (groupImpactMetric.id !== userGroupImpactMetric.groupImpactMetricId) {
    // Create new UserGroupImpactMetric model and update leaderboard
    let userGroupImpactMetricModel
    if (source === 'tab') {
      const amount = Math.round(microUSDsForTab)
      userGroupImpactMetricModel = await replaceUserGroupImpactMetricModel(
        userContext,
        user.id,
        groupImpactMetric.id,
        userGroupImpactMetric.id,
        amount
      )
    } else if (source === 'search') {
      const amount = Math.round(microUSDsForSearch)
      userGroupImpactMetricModel = await replaceUserGroupImpactMetricModel(
        userContext,
        user.id,
        groupImpactMetric.id,
        userGroupImpactMetric.id,
        0,
        amount
      )
    }
    GroupImpactLeaderboard.add(
      groupImpactMetric.id,
      user.id,
      userGroupImpactMetricModel.dollarContribution
    )
    await logUserGroupImpactMetricIfApplicable(
      groupImpactMetric,
      userGroupImpactMetric
    )
    return userGroupImpactMetricModel
  }
  let newDollarProgress
  let newTabDollarProgress
  let newSearchDollarProgress
  if (source === 'tab') {
    newTabDollarProgress = Math.round(
      userGroupImpactMetric.tabDollarContribution
        ? userGroupImpactMetric.tabDollarContribution + microUSDsForTab
        : microUSDsForTab
    )
    newSearchDollarProgress = userGroupImpactMetric.searchDollarContribution
      ? userGroupImpactMetric.searchDollarContribution
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
    newDollarProgress = Math.round(
      userGroupImpactMetric.dollarContribution + microUSDsForSearch
    )
  }
  GroupImpactLeaderboard.add(groupImpactMetric.id, user.id, newDollarProgress)
  return updateUserGroupImpactMetricModel(
    userGroupImpactMetric.id,
    newDollarProgress,
    newTabDollarProgress,
    newSearchDollarProgress
  )
}

export default updateUserGroupImpactMetric
