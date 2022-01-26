import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { BACKGROUND_IMAGE_CATEGORY } from '../constants'

/*
 * @extends BaseModel
 */
class BackgroundImageCategory extends BaseModel {
  static get name() {
    return BACKGROUND_IMAGE_CATEGORY
  }

  static get hashKey() {
    return 'name'
  }

  static get tableName() {
    return tableNames.backgroundImageCategory
  }

  static get schema() {
    return {
      name: types
        .string()
        .required()
        .description(
          `the backgroundground Image Category name that connects to images`
        ),
      collectionLink: types
        .string()
        .required()
        .description('the link to the unsplash collection'),
      collectionDescription: types
        .string()
        .required()
        .description('the description of the collection shown in the UI'),
    }
  }

  static get permissions() {
    return {
      get: () => true,
      getAll: () => true,
    }
  }
}

BackgroundImageCategory.register()

export default BackgroundImageCategory
