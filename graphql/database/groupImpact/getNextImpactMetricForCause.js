import dataGlobalHealth from '../cause/causes/globalHealth/causeData'
import { getImpactMetricById } from './impactMetricRepository'

/**
 * Fetch the ImpactMetric to use when instantiating a new instance of GroupImpactMetric.
 */
const getNextImpactMetricForCause = (causeId) => {
  // TODO: set up better relationships: Cause should have Charities, which
  // should have ImpactMetrics.
  if (causeId === dataGlobalHealth.id) {
    return getImpactMetricById('nQUobFEFe')
  }

  throw new Error('No Impact Metric can be selected for this causeId')
}

export default getNextImpactMetricForCause
