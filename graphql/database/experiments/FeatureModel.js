import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import { FEATURE } from '../constants'

/*
 * @extends BaseModel
 */
class Feature extends BaseModel {
  static get name() {
    return FEATURE
  }

  static get hashKey() {
    return 'featureName'
  }

  static get tableName() {
    return 'UNUSED_Features'
  }

  static get schema() {
    return {
      featureName: types.string().description('the name of the feature'),
      variation: types
        .any()
        .description('the value of the variation for this specific user'),
    }
  }
}

Feature.register()

export default Feature
