import dataEndingHunger from '../cause/causes/endingHunger/causeData'
import dataGlobalHealth from '../cause/causes/globalHealth/causeData'
import dataLgbtq from '../cause/causes/lgbtq/causeData'
import dataReproductiveHealth from '../cause/causes/reproductiveHealthCauseData'
import dataSeas from '../cause/causes/teamseas/causeData'
import dataTrees from '../cause/causes/trees/causeData'
import dataUkraine from '../cause/causes/ukraine/causeData'

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

  if (causeId === dataEndingHunger.id) {
    return getImpactMetricById('3wHhDkuRR')
  }

  if (causeId === dataLgbtq.id) {
    return getImpactMetricById('VqnFnXXML')
  }

  if (causeId === dataReproductiveHealth.id) {
    return getImpactMetricById('T79t1sGuc')
  }

  if (causeId === dataSeas.id) {
    return getImpactMetricById('gGJy2ebUD')
  }

  if (causeId === dataTrees.id) {
    return getImpactMetricById('Te3oC8KIP')
  }

  if (causeId === dataUkraine.id) {
    return getImpactMetricById('OyxVM0_Vc')
  }
  throw new Error('No Impact Metric can be selected for this causeId')
}

export default getNextImpactMetricForCause
