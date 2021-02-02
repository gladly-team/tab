import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import {
  BACKGROUND_IMAGE,
  BACKGROUND_IMAGE_LEGACY_CATEGORY,
} from '../constants'
import config from '../../config'

const mediaRoot = config.MEDIA_ENDPOINT

/*
 * @extends BaseModel
 */
class BackgroundImage extends BaseModel {
  static get name() {
    return BACKGROUND_IMAGE
  }

  static get hashKey() {
    return 'id'
  }

  static get indexes() {
    return [
      {
        hashKey: 'category',
        name: 'ImagesByCategory',
        type: 'global',
      },
    ]
  }

  static get tableName() {
    return tableNames.backgroundImages
  }

  static get schema() {
    const self = this
    return {
      id: types.uuid(),
      name: types.string(),
      // Filename.
      image: types.string(),
      // Absolute URL. Only returned during deserialization.
      imageURL: types.string().forbidden(),
      // category of the image
      category: types.string().valid(...self.allowedValues.category),
      // .default(self.fieldDefaults.category),
      // Filename.
      thumbnail: types.string(),
      // Absolute URL. Only returned during deserialization.
      thumbnailURL: types.string().forbidden(),
    }
  }

  static get permissions() {
    return {
      get: () => true,
      getAll: () => true,
      indexPermissions: {
        // I believe any user should be able to get images by category
        ImagesByCategory: {
          get: () => true,
          getAll: () => true,
        },
      },
    }
  }

  // originally i was going to have the default value be all but now i'm thinking it should just be undefined
  static get fieldDefaults() {
    return {
      category: BACKGROUND_IMAGE_LEGACY_CATEGORY,
    }
  }

  static get allowedValues() {
    return {
      category: [BACKGROUND_IMAGE_LEGACY_CATEGORY, 'cats'],
    }
  }
}

BackgroundImage.register()

export default BackgroundImage
