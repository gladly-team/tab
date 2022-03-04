import Joi from 'joi'
import SearchEngineModel from './SearchEngineModel'
import searchEngines from './searchEngineData'

const searchEngineModels = searchEngines.map(
  engineData => new SearchEngineModel(engineData)
)

// Validate data.
// TODO: this should eventually live in a better ORM.
const SearchEngineSchema = Joi.object(SearchEngineModel.schema)
searchEngineModels.forEach(data => {
  // With abortEarly=false, collect all errors before exiting.
  // https://github.com/sideway/joi/blob/master/API.md#anyvalidatevalue-options
  const validation = SearchEngineSchema.validate(data, { abortEarly: false })
  if (validation.error) {
    throw validation.error
  }
})

export default searchEngineModels
