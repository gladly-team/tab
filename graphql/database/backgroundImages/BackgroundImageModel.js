
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { BACKGROUND_IMAGE } from '../constants'

/*
 * @extends BaseModel
 */
class BackgroundImage extends BaseModel {
  static get name () {
    return BACKGROUND_IMAGE
  }

  static get hashKey () {
    return 'id'
  }

  static get tableName () {
    return tableNames.backgroundImages
  }

  static get schema () {
    return {
      id: types.uuid(),
      name: types.string(),
      fileName: types.string()
    }
  }

  static get permissions () {
    return {
      get: () => true,
      getAll: () => true
    }
  }
}

BackgroundImage.register()

export default BackgroundImage
