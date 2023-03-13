import RedisModel from '../base/RedisModel'
import types from '../fieldTypes'
import { CAUSE_IMPACT_METRIC_COUNT } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends RedisModel
 */
class CauseImpactMetricCount extends RedisModel {
  static get name() {
    return CAUSE_IMPACT_METRIC_COUNT
  }

  static get hashKey() {
    return 'id'
  }

  static get schema() {
    const self = this
    return {
      id: types
        .string()
        .required()
        .description(`Which cause and impact metric this count belongs to`),
      causeId: types
        .string()
        .required()
        .description(`Which cause this impact metric model count belongs to`),
      impactMetricId: types
        .string()
        .required()
        .description(
          `Which impact metric this impact metric model count belongs to`
        ),
      count: types
        .number()
        .default(self.fieldDefaults.count)
        .description(
          `How many times this impact metric has been completed for this cause`
        ),
    }
  }

  static get fieldDefaults() {
    return {
      count: 0,
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.allowAll,
    }
  }
}

CauseImpactMetricCount.register()

export default CauseImpactMetricCount
