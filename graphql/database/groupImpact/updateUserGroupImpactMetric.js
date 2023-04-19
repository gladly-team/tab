import { v4 as uuid } from 'uuid'
import UserGroupImpactMetric from './UserGroupImpactMetricModel'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'
import {
  GROUP_IMPACT_OVERRIDE,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'
import { getEstimatedMoneyRaisedPerTab } from '../globals/globals'
import UserModel from '../users/UserModel'

const groupImpactOverride = getPermissionsOverride(GROUP_IMPACT_OVERRIDE)

const replaceUserGroupImpactMetricModel = async (
  userContext,
  userId,
  groupImpactMetricId,
  oldUserGroupImpactMetricId = null,
  dollarContribution = 0
) => {
  const userGroupImpactMetric = await UserGroupImpactMetric.create(
    groupImpactOverride,
    {
      id: uuid(),
      userId,
      groupImpactMetricId,
      dollarContribution,
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

const updateUserGroupImpactMetricModel = async (id, dollarContribution) => {
  return UserGroupImpactMetric.update(groupImpactOverride, {
    id,
    dollarContribution,
  })
}

const updateUserGroupImpactMetric = async (
  userContext,
  user,
  groupImpactMetric
) => {
  // Fetch current UserGroupImpactMetric entry, create if does not exist
  let userGroupImpactMetric
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

  const microUSDsForTab = 10 ** 6 * getEstimatedMoneyRaisedPerTab()
  if (groupImpactMetric.id !== userGroupImpactMetric.groupImpactMetricId) {
    // Create new UserGroupImpactMetric model
    const userGroupImpactMetricModel = replaceUserGroupImpactMetricModel(
      userContext,
      user.id,
      groupImpactMetric.id,
      userGroupImpactMetric.id,
      Math.round(microUSDsForTab)
    )
    return userGroupImpactMetricModel
  }
  const newDollarProgress = Math.round(
    userGroupImpactMetric.dollarContribution + microUSDsForTab
  )
  return updateUserGroupImpactMetricModel(
    userGroupImpactMetric.id,
    newDollarProgress
  )
}

export default updateUserGroupImpactMetric
