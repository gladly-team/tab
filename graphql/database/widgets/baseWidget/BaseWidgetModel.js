
import BaseModel from '../../base/BaseModel'
import types from '../../fieldTypes'
import tableNames from '../../tables'
import { BASE_WIDGET } from '../../constants'

/*
 * @extends BaseModel
 */
class BaseWidget extends BaseModel {
  static get name () {
    return BASE_WIDGET
  }

  static get hashKey () {
    return 'id'
  }

  static get tableName () {
    return tableNames.widgets
  }

  static get schema () {
    const self = this
    return {
      id: types.uuid(),
      name: types.string(),
      position: types.number().integer()
        .default(self.fieldDefaults.position),
      type: types.string(),
      settings: types.object()
        .default(self.fieldDefaults.settings)
    }
  }

  static get fieldDefaults () {
    return {
      position: 0,
      settings: {}
    }
  }

  static get permissions () {
    return {
      get: () => true,
      getAll: () => true
    }
  }
}

BaseWidget.register()

export default BaseWidget
