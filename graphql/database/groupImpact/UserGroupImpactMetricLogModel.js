import RedisModel from '../base/RedisModel'
import types from '../fieldTypes'
import { USER_GROUP_IMPACT_METRIC_LOG } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'
import tableNames from '../tables'

/*
 * @extends RedisModel
 */
class UserGroupImpactMetricLogModel extends RedisModel {
  static get name() {
    return USER_GROUP_IMPACT_METRIC_LOG
  }

  static get hashKey() {
    return 'id'
  }

  static get rangeKey() {
    return 'dateStarted'
  }

  static get tableName() {
    return tableNames.userGroupImpactMetricLog
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
      dateStarted: types
        .string()
        .isoDate()
        .description(`the date the group impact started`),
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

UserGroupImpactMetricLogModel.register()

export default UserGroupImpactMetricLogModel
