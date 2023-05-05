import moment from 'moment'

import RedisModel from '../base/RedisModel'
import types from '../fieldTypes'
import { GROUP_IMPACT_METRIC } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends RedisModel
 */
class GroupImpactMetric extends RedisModel {
  static get name() {
    return GROUP_IMPACT_METRIC
  }

  static get hashKey() {
    return 'id'
  }

  static get schema() {
    const self = this
    return {
      id: types
        .string()
        .length(9)
        .required()
        .description(`The ID for the GroupImpactMetric instance`),
      causeId: types
        .string()
        .required()
        .description(`Which cause this GroupImpactMetric belongs to`),
      impactMetricId: types
        .string()
        .required()
        .description(`the impact metric this GroupImpactMetric corresponds to`),
      dollarProgress: types
        .number()
        .required()
        .description(
          `the dollar amount raised for this instance of GroupImpactMetric so far in microUSDs`
        ),
      dollarProgressFromTab: types
        .number()
        .required()
        .description(
          `the dollar amount raised for this instance of GroupImpactMetric so far in microUSDs from just tab`
        ),
      dollarProgressFromSearch: types
        .number()
        .required()
        .description(
          `the dollar amount raised for this instance of GroupImpactMetric so far in microUSDs from just search`
        ),
      dollarGoal: types
        .number()
        .required()
        .description(
          `the dollar amount to raise for this specific instance of GroupImpact in microUSDs`
        ),
      dateStarted: types
        .string()
        .isoDate()
        .default(self.fieldDefaults.dateStarted)
        .description(`When this GroupImpactMetric was started`),
      dateCompleted: types
        .string()
        .isoDate()
        .description(`When this GroupImpactMetric was completed`),
    }
  }

  static get fieldDefaults() {
    return {
      dollarProgressFromTab: 0,
      dollarProgressFromSearch: 0,
      dateStarted: moment.utc().toISOString(),
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.allowAll,
    }
  }
}

GroupImpactMetric.register()

export default GroupImpactMetric
