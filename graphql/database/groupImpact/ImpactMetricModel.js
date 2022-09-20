import Model from '../base/Model'
import types from '../fieldTypes'
import { IMPACT_METRIC } from '../constants'

/*
 * @extends Model
 */
class ImpactMetric extends Model {
  static get name() {
    return IMPACT_METRIC
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
        .description(`ID for the ImpactMetric entity. Nanoid.`),
      causeId: types
        .string()
        .required()
        .description(`The causeId that this ImpactMetric corresponds to`),
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
        .string()
        .required()
        .description(
          `Long-form description of the ImpactMetric. Is usually a few sentences/paragraph about the imapct metric.`
        ),
      metricTitle: types
        .string()
        .required()
        .description(
          `Metric title. Should be placeable in a sentence. Example: '1 home visit'`
        ),
      impactTitle: types
        .string()
        .required()
        .description(
          `Impact action title. Should be a longer title with a verb as well as a noun. Example: 'Provide 1 visit from a community health worker'`
        ),
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
