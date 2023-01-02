import Joi from 'joi'
import CauseModel from './CauseModel'
import dataCats from './causes/cats/causeData'
import dataTeamseas from './causes/teamseas/causeData'
import dataBlackEquity from './causes/blackEquity/causeData'
import dataTrees from './causes/trees/causeData'
import dataGlobalHealth from './causes/globalHealth/causeData'
import dataEndingHunger from './causes/endingHunger/causeData'
import dataUkraine from './causes/ukraine/causeData'
import dataReproductiveHealth from './causes/reproductiveHealthCauseData'
import { CAUSE_IMPACT_TYPES } from '../constants'
import getFeature from '../experiments/getFeature'
import { GLOBAL_HEALTH_GROUP_IMPACT } from '../experiments/experimentConstants'

const causes = [
  new CauseModel(dataCats),
  new CauseModel(dataTeamseas),
  new CauseModel(dataBlackEquity),
  new CauseModel(dataTrees),
  new CauseModel(dataGlobalHealth),
  new CauseModel(dataEndingHunger),
  new CauseModel(dataUkraine),
  new CauseModel(dataReproductiveHealth),
]

// Use this method to dynamically overwrite specific fields in Cause Models.
const overrideCauseModel = (cause, index) => {
  console.log('overrideCauseModel')
  if (cause.id === dataGlobalHealth.id) {
    const globalHealthGroupImpactEnabled = getFeature(
      GLOBAL_HEALTH_GROUP_IMPACT
    ).variation
    console.log(globalHealthGroupImpactEnabled)
    causes[index].impactType = globalHealthGroupImpactEnabled
      ? CAUSE_IMPACT_TYPES.group
      : CAUSE_IMPACT_TYPES.none
    console.log(causes[index])
  }
}

// TODO: remove after populating data
// console.log('causes:', causes)

// Validate data.
// TODO: this should eventually live in a better ORM.
const causeSchema = Joi.object(CauseModel.schema)
causes.forEach((data, index) => {
  overrideCauseModel(data, index)
  // With abortEarly=false, collect all errors before exiting.
  // https://github.com/sideway/joi/blob/master/API.md#anyvalidatevalue-options
  const validation = causeSchema.validate(data, { abortEarly: false })
  if (validation.error) {
    throw validation.error
  }
})

export default causes
