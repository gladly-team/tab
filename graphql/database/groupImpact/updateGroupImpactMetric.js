import { nanoid } from 'nanoid'
import moment from 'moment'
import GroupImpactMetricModel from './GroupImpactMetricModel'
import CauseGroupImpactMetricModel from './CauseGroupImpactMetricModel'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'
import {
  GROUP_IMPACT_OVERRIDE,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'
import getNextImpactMetricForCause from './getNextImpactMetricForCause'
import {
  getEstimatedMoneyRaisedPerTab,
  getEstimatedMoneyRaisedPerSearch,
} from '../globals/globals'
import incrementCauseImpactMetricCount from './incrementCauseImpactMetricCount'

const groupImpactOverride = getPermissionsOverride(GROUP_IMPACT_OVERRIDE)

const createCauseGroupImpactMetricModel = async (
  causeId,
  groupImpactMetricId
) => {
  return CauseGroupImpactMetricModel.create(groupImpactOverride, {
    causeId,
    groupImpactMetricId,
  })
}

const updateCauseGroupImpactMetricModel = async (
  causeId,
  groupImpactMetricId
) => {
  return CauseGroupImpactMetricModel.update(groupImpactOverride, {
    causeId,
    groupImpactMetricId,
  })
}

const createGroupImpactMetricModel = async (
  causeId,
  groupImpactMetricId,
  impactMetric
) => {
  return GroupImpactMetricModel.create(groupImpactOverride, {
    id: groupImpactMetricId,
    causeId,
    impactMetricId: impactMetric.id,
    dollarProgress: 0,
    dollarProgressFromTab: 0,
    dollarProgressFromSearch: 0,
    dollarGoal: impactMetric.dollarAmount,
    dateStarted: moment.utc().toISOString(),
  })
}

const updateGroupImpactMetricModel = async (
  groupImpactMetricId,
  dollarProgress,
  dollarProgressFromTab,
  dollarProgressFromSearch,
  dateCompleted
) => {
  return GroupImpactMetricModel.update(groupImpactOverride, {
    id: groupImpactMetricId,
    dollarProgress,
    dollarProgressFromTab,
    dollarProgressFromSearch,
    ...(dateCompleted && { dateCompleted }),
  })
}

const updateGroupImpactMetric = async (userContext, causeId, revenueType) => {
  let groupImpactMetricId

  try {
    ;({ groupImpactMetricId } = await CauseGroupImpactMetricModel.get(
      userContext,
      causeId
    ))
  } catch (e) {
    if (e.code === DatabaseItemDoesNotExistException.code) {
      groupImpactMetricId = nanoid(9)
      await createCauseGroupImpactMetricModel(causeId, groupImpactMetricId)
    } else {
      throw e
    }
  }

  // Fetch current GroupImpactMetric entry, create if does not exist
  let groupImpactMetric
  try {
    groupImpactMetric = await GroupImpactMetricModel.get(
      userContext,
      groupImpactMetricId
    )
  } catch (e) {
    if (e.code === DatabaseItemDoesNotExistException.code) {
      // Get the impact metric ID here
      groupImpactMetric = await createGroupImpactMetricModel(
        causeId,
        groupImpactMetricId,
        getNextImpactMetricForCause(causeId)
      )
    } else {
      throw e
    }
  }

  // Now update GroupImpactMetric
  let { dollarProgress, dollarProgressFromSearch, dollarProgressFromTab } =
    groupImpactMetric
  dollarProgressFromSearch = dollarProgressFromSearch || 0
  dollarProgressFromTab = dollarProgressFromTab || 0

  if (revenueType === 'tab') {
    const addTo = 10 ** 6 * getEstimatedMoneyRaisedPerTab()
    dollarProgress = Math.round(dollarProgress + addTo)
    dollarProgressFromTab = Math.round(dollarProgressFromTab + addTo)
  }

  if (revenueType === 'search') {
    const addTo = 10 ** 6 * getEstimatedMoneyRaisedPerSearch()
    dollarProgress = Math.round(dollarProgress + addTo)
    dollarProgressFromSearch = Math.round(dollarProgressFromSearch + addTo)
  }

  if (dollarProgress > groupImpactMetric.dollarGoal) {
    // todo: @jtan figure out transactionality
    // Update (End) GroupImpactMetric
    await updateGroupImpactMetricModel(
      groupImpactMetricId,
      dollarProgress,
      dollarProgressFromTab,
      dollarProgressFromSearch,
      moment.utc().toISOString()
    )
    // Create new GroupImpactMetric model
    const newGroupImpactMetricId = nanoid(9)
    await createGroupImpactMetricModel(
      causeId,
      newGroupImpactMetricId,
      getNextImpactMetricForCause(causeId)
    )
    // Update Count entity
    await incrementCauseImpactMetricCount(
      causeId,
      groupImpactMetric.impactMetricId
    )
    // Update join table
    return updateCauseGroupImpactMetricModel(causeId, newGroupImpactMetricId)
  }
  // Update GroupImpactMetric
  return updateGroupImpactMetricModel(
    groupImpactMetricId,
    dollarProgress,
    dollarProgressFromTab,
    dollarProgressFromSearch
  )
}

export default updateGroupImpactMetric
