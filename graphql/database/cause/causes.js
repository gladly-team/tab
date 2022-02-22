import Joi from 'joi'
import CauseModel from './CauseModel'
import dataCats from './causes/cats/causeData'
import dataTeamseas from './causes/teamseas/causeData'
import dataBlackEquity from './causes/blackEquity/causeData'
import dataTrees from './causes/trees/causeData'

const causes = [
  new CauseModel(dataCats),
  new CauseModel(dataTeamseas),
  new CauseModel(dataBlackEquity),
  new CauseModel(dataTrees),
]

// TODO: remove after populating data
// console.log('causes:', causes)

// Validate data.
// TODO: this should eventually live in a better ORM.
const causeSchema = Joi.object(CauseModel.schema)
causes.forEach(data => {
  // With abortEarly=false, collect all errors before exiting.
  // https://github.com/sideway/joi/blob/master/API.md#anyvalidatevalue-options
  const validation = causeSchema.validate(data, { abortEarly: false })
  if (validation.error) {
    throw validation.error
  }
})

export default causes
