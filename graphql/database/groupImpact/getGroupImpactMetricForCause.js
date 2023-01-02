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

  console.log(causeGroupImpactMetric)
  try {
    const result = await GroupImpactMetricModel.get(
      userContext,
      causeGroupImpactMetric.groupImpactMetricId
    )
    console.log(result)
    return result
  } catch (e) {
    throw e
  }
}

export default getGroupImpactMetricForCause
