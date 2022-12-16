import { find, filter } from 'lodash/collection'
import impactMetrics from './impactMetrics'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'
import getFeature from '../experiments/getFeature'
import { REDUCED_IMPACT_COST } from '../experiments/experimentConstants'

const modifyImpactCost = (metric) => {
  return {
    ...metric,
    dollarAmount: 0.01e6, // one cent
  }
}

// Handle any modifications of the hardcoded metrics.
const modifyMetrics = (metrics) => {
  let newMetrics = metrics
  const reduceImpactCost = getFeature(REDUCED_IMPACT_COST).variation
  if (reduceImpactCost) {
    newMetrics = metrics.map(modifyImpactCost)
  }
  return newMetrics
}

export const getImpactMetricById = (id) => {
  const impactMetric = find(impactMetrics, { id })

  if (!impactMetric) {
    throw new DatabaseItemDoesNotExistException()
  }

  return modifyMetrics([impactMetric])[0]
}

export const getImpactMetricsByCharityId = (charityId) => {
  return modifyMetrics(filter(impactMetrics, { charityId }))
}
