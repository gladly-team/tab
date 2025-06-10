import dataEndingHunger from '../cause/causes/endingHunger/causeData'
import dataGlobalHealth from '../cause/causes/globalHealth/causeData'
import dataLgbtq from '../cause/causes/lgbtq/causeData'
import dataReproductiveHealth from '../cause/causes/reproductiveHealthCauseData'
import dataSeas from '../cause/causes/teamseas/causeData'
import dataTrees from '../cause/causes/trees/causeData'
import dataUkraine from '../cause/causes/ukraine/causeData'
import dataCats from '../cause/causes/cats/causeData'
import dataEndingPoverty from '../cause/causes/endingPoverty/causeData'
import dataDogs from '../cause/causes/dogs/causeData'

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
    return getImpactMetricById('kTeL0g_HM')
  }

  if (causeId === dataTrees.id) {
    return getImpactMetricById('Te3oC8KIP')
  }

  if (causeId === dataUkraine.id) {
    return getImpactMetricById('OyxVM0_Vc')
  }

  if (causeId === dataCats.id) {
    return getImpactMetricById('A8bVxmrf5')
  }

  if (causeId === dataEndingPoverty.id) {
    return getImpactMetricById('V9nF1X2ML')
  }

  if (causeId === dataDogs.id) {
    return getImpactMetricById('Z4pLqjWn9')
  }

  throw new Error('No Impact Metric can be selected for this causeId')
}

export default getNextImpactMetricForCause
