import getGroupImpactMetricForCause from './getGroupImpactMetricForCause'
import CauseImpactMetricCount from './CauseImpactMetricCountModel'

const getCauseImpactMetricCountKey = (causeId, impactMetricId) =>
  `${causeId}_${impactMetricId}`

const getCauseImpactMetricCount = async (userContext, causeId) => {
  const groupImpactMetric = await getGroupImpactMetricForCause(
    userContext,
    causeId
  )

  if (groupImpactMetric === null) return null

  const causeImpactMetricCount = await CauseImpactMetricCount.getOrNull(
    userContext,
    getCauseImpactMetricCountKey(causeId, groupImpactMetric.impactMetricId)
  )
  return causeImpactMetricCount && causeImpactMetricCount.count
}

export default getCauseImpactMetricCount
