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
  impactMetric,
  groupImpactMetric
) => {
  let rt = {
    id: groupImpactMetricId,
    causeId,
    impactMetricId: impactMetric.id,
    dollarProgress: 0,
    dollarProgressFromTab: 0,
    dollarProgressFromSearch: 0,
    dollarGoal: impactMetric.dollarAmount,
    dateStarted: moment.utc().toISOString(),
  }

  if (impactMetric.timeboxed) {
    const dateExpires = groupImpactMetric.dateExpires
      ? moment(groupImpactMetric.dateExpires).add(1, 'week').toISOString()
      : moment()
          .utc()
          .day(8)
          .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
          .toISOString() // Default to 9AM, following Monday
    rt = {
      ...rt,
      dateExpires,
    }
  }

  const r = GroupImpactMetricModel.create(groupImpactOverride, rt)
  return r
}

const isGroupImpactMetricCompleted = (groupImpactMetric, dollarProgress) => {
  // Timeboxed GroupImpactMetric
  if (
    groupImpactMetric.dateExpires &&
    moment().diff(moment(groupImpactMetric.dateExpires)) > 0
  ) {
    return true
  }

  if (
    !groupImpactMetric.dateExpires &&
    dollarProgress > groupImpactMetric.dollarGoal
  ) {
    return true
  }

  return false
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
  let newDollarProgress = 0.0
  let { dollarProgressFromTab, dollarProgressFromSearch } = groupImpactMetric

  if (revenueType === 'tab') {
    const addTo = 10 ** 6 * getEstimatedMoneyRaisedPerTab()
    newDollarProgress = Math.round(groupImpactMetric.dollarProgress + addTo)
    dollarProgressFromTab = Math.round(
      groupImpactMetric.dollarProgressFromTab + addTo
    )
  }

  if (revenueType === 'search') {
    const addTo = 10 ** 6 * getEstimatedMoneyRaisedPerSearch()
    newDollarProgress = Math.round(groupImpactMetric.dollarProgress + addTo)
    dollarProgressFromSearch = Math.round(
      groupImpactMetric.dollarProgressFromSearch + addTo
    )
  }

  if (isGroupImpactMetricCompleted(groupImpactMetric, newDollarProgress)) {
    // todo: @jtan figure out transactionality
    // Update (End) GroupImpactMetric
    const gi = await updateGroupImpactMetricModel(
      groupImpactMetricId,
      newDollarProgress,
      dollarProgressFromTab,
      dollarProgressFromSearch,
      moment.utc().toISOString()
    )
    // Create new GroupImpactMetric model
    const newGroupImpactMetricId = nanoid(9)
    await createGroupImpactMetricModel(
      causeId,
      newGroupImpactMetricId,
      getNextImpactMetricForCause(causeId),
      groupImpactMetric
    )

    // Update Count entity
    await incrementCauseImpactMetricCount(
      causeId,
      groupImpactMetric.impactMetricId
    )

    // Update join table
    await updateCauseGroupImpactMetricModel(causeId, newGroupImpactMetricId)

    return gi
  }
  // Update GroupImpactMetric
  return updateGroupImpactMetricModel(
    groupImpactMetricId,
    newDollarProgress,
    dollarProgressFromTab,
    dollarProgressFromSearch
  )
}

export default updateGroupImpactMetric
