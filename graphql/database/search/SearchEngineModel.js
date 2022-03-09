import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import { SEARCH_ENGINE } from '../constants'

/*
 * @extends BaseModel
 */
class SearchEngine extends BaseModel {
  static get name() {
    return SEARCH_ENGINE
  }

  static get hashKey() {
    return 'id'
  }

  static get tableName() {
    // This ORM assumes a DynamoDB table, but we're not using one here.
    return 'UNUSED_SearchEngines'
  }

  static get schema() {
    return {
      id: types
        .string()
        .description(`ID of the Search Engine`)
        .required(),
      name: types
        .string()
        .description(`Name of the Search Engine`)
        .required(),
      searchUrl: types
        .string()
        .description(
          `query string to redirect the user to after using the search bar`
        )
        .required(),
      rank: types
        .number()
        .description(`what order to display the search engine in a list`),
      isCharitable: types
        .boolean()
        .description(
          `Whether or not the user can earn extra impact with this Search Engine`
        )
        .required(),
      inputPrompt: types
        .string()
        .description(`Display string to display in the search bar`)
        .required(),
    }
  }

  static get fieldDefaults() {
    return {}
  }
}

SearchEngine.register()

export default SearchEngine
