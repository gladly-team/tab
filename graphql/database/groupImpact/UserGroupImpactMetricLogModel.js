import types from '../fieldTypes'
import { USER_GROUP_IMPACT_METRIC_LOG } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'
import tableNames from '../tables'
import DynamoDBModel from '../base/DynamoDBModel'

/*
 * @extends DynamoDBModel
 */
class UserGroupImpactMetricLogModel extends DynamoDBModel {
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

  static get indexes() {
    return [
      {
        hashKey: 'userId',
        rangeKey: 'dateStarted',
        name: 'UserGroupImpactMetricLogByUser',
        type: 'global',
      },
    ]
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
      referralDollarContribution: types
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
      referralDollarContribution: 0,
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.allowAll,
      create: permissionAuthorizers.allowAll,
      indexPermissions: {
        UserGroupImpactMetricLogByUser: {
          // Note: we should avoid showing a user the user IDs (or other
          // details) of their recruited users.
          get: permissionAuthorizers.userIdMatchesHashKey,
        },
      },
    }
  }
}

UserGroupImpactMetricLogModel.register()

export default UserGroupImpactMetricLogModel
