import RedisModel from '../base/RedisModel'
import types from '../fieldTypes'
import { CAUSE_GROUP_IMPACT_METRIC } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends RedisModel
 */
class CauseGroupImpactMetric extends RedisModel {
  static get name() {
    return CAUSE_GROUP_IMPACT_METRIC
  }

  static get hashKey() {
    return 'causeId'
  }

  static get schema() {
    return {
      causeId: types
        .string()
        .required()
        .description(`Which cause this GroupImpactMetric belongs to`),
      groupImpactMetricId: types
        .string()
        .length(9)
        .required()
        .description(`The current instance of Group Impact`),
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.allowAll,
    }
  }
}

CauseGroupImpactMetric.register()

export default CauseGroupImpactMetric
