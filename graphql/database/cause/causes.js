import Joi from 'joi'
import CauseModel from './CauseModel'
import dataCA6A5C2uj from './causes/CA6A5C2uj/causeData'
import dataSGa6zohkY from './causes/SGa6zohkY/causeData'

const causes = [new CauseModel(dataCA6A5C2uj), new CauseModel(dataSGa6zohkY)]

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
