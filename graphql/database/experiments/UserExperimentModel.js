import moment from 'moment'
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_EXPERIMENT } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class UserExperimentModel extends BaseModel {
  static get name() {
    return USER_EXPERIMENT
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'experimentId'
  }

  static get tableName() {
    return tableNames.userExperiment
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
      experimentId: types
        .string()
        .required()
        .description(`The experiment ID from GrowthBook`),
      variationId: types
        .string()
        .required()
        .description(`The variation ID from GrowthBook`),
      timestampAssigned: types
        .string()
        .isoDate()
        .default(self.fieldDefaults.timestampAssigned)
        .description(`time user assigned to group`)
        .required(),
    }
  }

  static get fieldDefaults() {
    return {
      timestampAssigned: moment.utc().toISOString(),
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

UserExperimentModel.register()

export default UserExperimentModel
