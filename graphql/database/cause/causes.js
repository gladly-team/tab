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
import { isGlobalHealthGroupImpactEnabled } from '../../utils/feature-flags'
import { CAUSE_IMPACT_TYPES } from '../constants'

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

// TODO: Find a more efficient way to overwrite custom fields
// Use this method to dynamically overwrite specific fields in Cause Models.
const overrideCauseModel = (cause) => {
  if (cause.id === dataGlobalHealth.id) {
    cause.impactType = isGlobalHealthGroupImpactEnabled() ? CAUSE_IMPACT_TYPES.group : CAUSE_IMPACT_TYPES.none
  }
}

// TODO: remove after populating data
// console.log('causes:', causes)

// Validate data.
// TODO: this should eventually live in a better ORM.
const causeSchema = Joi.object(CauseModel.schema)
causes.forEach(data => {
  overrideCauseModel(data)
  // With abortEarly=false, collect all errors before exiting.
  // https://github.com/sideway/joi/blob/master/API.md#anyvalidatevalue-options
  const validation = causeSchema.validate(data, { abortEarly: false })
  if (validation.error) {
    throw validation.error
  }
})

export default causes
