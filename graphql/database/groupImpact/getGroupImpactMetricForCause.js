import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'
import CauseGroupImpactMetricModel from './CauseGroupImpactMetricModel'
import GroupImpactMetricModel from './GroupImpactMetricModel'

/**
 * Fetch the GroupImpactMetric associated with a causeId.
 */
const getGroupImpactMetricForCause = async (userContext, causeId) => {
  let causeGroupImpactMetric
  try {
    causeGroupImpactMetric = await CauseGroupImpactMetricModel.get(
      userContext,
      causeId
    )
  } catch (e) {
    // We just return null if there is no GroupImpactMetric for a causeId.
    if (e.code === DatabaseItemDoesNotExistException.code) {
      return null
    }
    throw e
  }

  try {
    return await GroupImpactMetricModel.get(
      userContext,
      causeGroupImpactMetric.groupImpactMetricId
    )
  } catch (e) {
    throw e
  }
}

export default getGroupImpactMetricForCause
