import Joi from 'joi'
import ImpactMetricModel from './ImpactMetricModel'
import dataReproductiveHealth from './impactMetrics/reproductiveHealth'

const impactMetricsByCause = {}
const impactMetricSchema = Joi.object(ImpactMetricModel.schema)
const processImpactMetricData = impactMetricData => {
  // Validate data.
  // TODO: this should eventually live in a better ORM.
  impactMetricData.impactMetrics.forEach(data => {
    // With abortEarly=false, collect all errors before exiting.
    // https://github.com/sideway/joi/blob/master/API.md#anyvalidatevalue-options
    const validation = impactMetricSchema.validate(data, { abortEarly: false })
    if (validation.error) {
      throw validation.error
    }
  })
  impactMetricsByCause[impactMetricData.causeId] =
    impactMetricData.impactMetrics
}

processImpactMetricData(dataReproductiveHealth)

export default impactMetricsByCause
