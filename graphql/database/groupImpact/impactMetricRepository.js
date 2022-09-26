import { find, filter } from 'lodash/collection'
import impactMetrics from './impactMetrics'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'

export const getImpactMetricById = id => {
  const impactMetric = find(impactMetrics, { id })

  if (!impactMetric) {
    throw new DatabaseItemDoesNotExistException()
  }

  return impactMetric
}

export const getImpactMetricsByCharityId = charityId => {
  return filter(impactMetrics, { charityId })
}
