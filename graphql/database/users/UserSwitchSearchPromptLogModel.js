import moment from 'moment'
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_SWITCH_SEARCH_PROMPT_LOG } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'
import { VALID_SEARCH_ENGINES } from '../search/searchEngineData'

/*
 * @extends BaseModel
 */
class UserSwitchSearchExperimentModel extends BaseModel {
  static get name() {
    return USER_SWITCH_SEARCH_PROMPT_LOG
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'timestamp'
  }

  static get tableName() {
    return tableNames.userSwitchSearchPromptLog
  }

  static get schema() {
    const self = this
    return {
      userId: types
        .string()
        .required()
        .description(
          `The unique user ID from our authentication service (Firebase)`
        ),
      searchEnginePrompted: types
        .string()
        .required()
        .valid(VALID_SEARCH_ENGINES)
        .description(`The search engine for which the user has been prompted`),
      switched: types
        .boolean()
        .required()
        .description(`Whether or not the user switched search engine`),
      timestamp: types
        .string()
        .isoDate()
        .default(self.fieldDefaults.timestamp)
        .description(`time user prompted`)
        .required(),
    }
  }

  static get fieldDefaults() {
    return {
      timestamp: moment.utc().toISOString(),
    }
  }

  static get permissions() {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

UserSwitchSearchExperimentModel.register()

export default UserSwitchSearchExperimentModel
