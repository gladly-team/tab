import Joi from 'joi'
import CauseModel from './CauseModel'
import dataCats from './causes/cats/causeData'
import dataTeamseas from './causes/teamseas/causeData'
import dataBlackEquity from './causes/blackEquity/causeData'
import dataDemocracy from './causes/democracy/causeData'
import dataTrees from './causes/trees/causeData'
import dataGlobalHealth from './causes/globalHealth/causeData'
import dataEndingHunger from './causes/endingHunger/causeData'
import dataUkraine from './causes/ukraine/causeData'
import dataReproductiveHealth from './causes/reproductiveHealthCauseData'
import dataLgbtq from './causes/lgbtq/causeData'
import dataEndingPoverty from './causes/endingPoverty/causeData'
import dataGamesForLove from './causes/gamesForLove/causeData'
import dataBoysAndGirlsClub from './causes/boysAndGirlsClub/causeData'
import dataDisasterRelief from './causes/disasterRelief/causeData'
import dataDogs from './causes/dogs/causeData'
import dataEndingAnimalSuffering from './causes/endingAnimalSuffering/causeData'
import { CAUSE_IMPACT_TYPES } from '../constants'
import getFeature from '../experiments/getFeature'
import {
  ENDING_HUNGER_GROUP_IMPACT,
  GLOBAL_HEALTH_GROUP_IMPACT,
} from '../experiments/experimentConstants'

const causes = [
  new CauseModel(dataCats),
  new CauseModel(dataDogs),
  new CauseModel(dataTeamseas),
  new CauseModel(dataBlackEquity),
  new CauseModel(dataTrees),
  new CauseModel(dataGlobalHealth),
  new CauseModel(dataEndingHunger),
  new CauseModel(dataUkraine),
  new CauseModel(dataReproductiveHealth),
  new CauseModel(dataLgbtq),
  new CauseModel(dataGamesForLove),
  new CauseModel(dataEndingPoverty),
  new CauseModel(dataBoysAndGirlsClub),
  new CauseModel(dataDemocracy),
  new CauseModel(dataDisasterRelief),
  new CauseModel(dataEndingAnimalSuffering),
]

// Use this method to dynamically overwrite specific fields in Cause Models.
const overrideCauseModel = (cause, index) => {
  if (cause.id === dataGlobalHealth.id) {
    const globalHealthGroupImpactEnabled = getFeature(
      GLOBAL_HEALTH_GROUP_IMPACT
    ).variation
    causes[index].impactType = globalHealthGroupImpactEnabled
      ? CAUSE_IMPACT_TYPES.group
      : CAUSE_IMPACT_TYPES.individual
  }

  if (cause.id === dataEndingHunger.id) {
    const endingHungerGroupImpactEnabled = getFeature(
      ENDING_HUNGER_GROUP_IMPACT
    ).variation
    causes[index].impactType = endingHungerGroupImpactEnabled
      ? CAUSE_IMPACT_TYPES.group
      : CAUSE_IMPACT_TYPES.individual
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
