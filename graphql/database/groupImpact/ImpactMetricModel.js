import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import { IMPACT_METRIC } from '../constants'

/*
 * @extends DynamoDBModel
 */
class ImpactMetric extends DynamoDBModel {
  static get name() {
    return IMPACT_METRIC
  }

  static get hashKey() {
    return 'id'
  }

  static get tableName() {
    return 'UNUSED_ImpactMetrics'
  }

  static get schema() {
    const self = this
    return {
      id: types
        .string()
        .length(9)
        .required()
        .description(`ID for the ImpactMetric entity. Nanoid.`),
      charityId: types
        .string()
        .required()
        .description(`the charity id that maps to the charity table`),
      dollarAmount: types
        .number()
        .required()
        .description(
          `the dollar amount required to achieve an instance of this ImpactMetric`
        ),
      description: types
        .number()
        .required()
        .description(`Description of the ImpactMetric`),
      name: types
        .number()
        .required()
        .description(`Name of the impact metric`),
      active: types
        .boolean()
        .default(self.fieldDefaults.active)
        .description(
          `Whether or not this ImpactMetric is eligible to be selected for a Group`
        ),
    }
  }

  static get fieldDefaults() {
    return {
      active: true,
    }
  }
}

ImpactMetric.register()

export default ImpactMetric
