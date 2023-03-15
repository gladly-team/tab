import CauseImpactMetricCountModel from './CauseImpactMetricCountModel'
import {
  GROUP_IMPACT_OVERRIDE,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'

const groupImpactOverride = getPermissionsOverride(GROUP_IMPACT_OVERRIDE)

const getCauseImpactMetricCountKey = (causeId, impactMetricId) =>
  `${causeId}_${impactMetricId}`

const incrementCauseImpactMetricCount = async (causeId, impactMetricId) => {
  const oldCountModel = await CauseImpactMetricCountModel.getOrCreate(
    groupImpactOverride,
    {
      id: getCauseImpactMetricCountKey(causeId, impactMetricId),
      causeId,
      impactMetricId,
      count: 0,
    }
  )

  return CauseImpactMetricCountModel.update(groupImpactOverride, {
    ...oldCountModel.item,
    count: oldCountModel.item.count + 1,
  })
}

export default incrementCauseImpactMetricCount
