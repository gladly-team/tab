import Joi from 'joi'
import ImpactMetricModel from './ImpactMetricModel'
import impactMetricData from './impactMetricData'

const impactMetricSchema = Joi.object(ImpactMetricModel.schema)

// Validate data.
// TODO: this should eventually live in a better ORM.
impactMetricData.forEach(data => {
  // With abortEarly=false, collect all errors before exiting.
  // https://github.com/sideway/joi/blob/master/API.md#anyvalidatevalue-options
  const validation = impactMetricSchema.validate(data, { abortEarly: false })
  if (validation.error) {
    throw validation.error
  }
})

export default impactMetricData
