import RedisModel from '../base/RedisModel'
import types from '../fieldTypes'
import { USER_GROUP_IMPACT_METRIC } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends RedisModel
 */
class UserGroupImpactMetricModel extends RedisModel {
  static get name() {
    return USER_GROUP_IMPACT_METRIC
  }

  static get hashKey() {
    return 'id'
  }

  static get schema() {
    return {
      id: types
        .uuid()
        .required()
        .description(`The ID for the UserGroupImpactMetric instance`),
      userId: types
        .string()
        .required()
        .description(`Which user this UserGroupImpactMetric belongs to`),
      groupImpactMetricId: types
        .string()
        .required()
        .description(
          `Which GroupImpactMetric this UserGroupImpactMetric belongs to`
        ),
      dollarContribution: types
        .number()
        .required()
        .description(
          `the contribution of the individual user to the GroupImpactMetric in micro USDs`
        ),
      tabDollarContribution: types
        .number()
        .required()
        .description(
          `the contribution of the individual user to the GroupImpactMetric in micro USDs from tabs`
        ),
      searchDollarContribution: types
        .number()
        .required()
        .description(
          `the contribution of the individual user to the GroupImpactMetric in micro USDs from search`
        ),
      shopDollarContribution: types
        .number()
        .required()
        .description(
          `the contribution of the individual user to the GroupImpactMetric in micro USDs from shopping`
        ),
    }
  }

  static get fieldDefaults() {
    return {
      tabDollarContribution: 0,
      searchDollarContribution: 0,
      shopDollarContribution: 0,
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.allowAll,
    }
  }
}

UserGroupImpactMetricModel.register()

export default UserGroupImpactMetricModel
