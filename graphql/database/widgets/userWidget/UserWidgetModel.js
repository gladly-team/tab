
import BaseModel from '../../base/BaseModel'
import types from '../../fieldTypes'
import tableNames from '../../tables'
import { USER_WIDGET } from '../../constants'
import {
  permissionAuthorizers
} from '../../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class UserWidget extends BaseModel {
  static get name () {
    return USER_WIDGET
  }

  static get hashKey () {
    return 'userId'
  }

  static get rangeKey () {
    return 'widgetId'
  }

  static get tableName () {
    return tableNames.userWidgets
  }

  static get schema () {
    const self = this
    return {
      userId: types.uuid(),
      widgetId: types.uuid(),
      enabled: types.boolean()
        .default(self.fieldDefaults.enabled),
      visible: types.boolean()
        .default(self.fieldDefaults.visible),
      data: types.object()
        .default(self.fieldDefaults.data),
      config: types.object()
        .default(self.fieldDefaults.config)
    }
  }

  static get fieldDefaults () {
    return {
      enabled: false,
      visible: false,
      data: {},
      config: {}
    }
  }

  static get permissions () {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      getAll: () => false,
      update: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey
    }
  }
}

UserWidget.register()

export default UserWidget
