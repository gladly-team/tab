import { find, filter } from 'lodash/collection'
import impactMetrics from './impactMetrics'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'
import getCause from '../cause/getCause'

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

export const getImpactMetricsByCauseId = async causeId => {
  try {
    const cause = await getCause(causeId)
    return getImpactMetricsByCharityId(cause.charityId)
  } catch (e) {
    throw e
  }
}
