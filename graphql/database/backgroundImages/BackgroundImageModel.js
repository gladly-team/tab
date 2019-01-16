import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { BACKGROUND_IMAGE } from '../constants'
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

  static get tableName() {
    return tableNames.backgroundImages
  }

  static get schema() {
    return {
      id: types.uuid(),
      name: types.string(),
      // Filename.
      image: types.string(),
      // Absolute URL. Only returned during deserialization.
      imageURL: types.string().forbidden(),
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
    }
  }

  static get fieldDeserializers() {
    return {
      imageURL: (imageURL, obj) => {
        const finalURL = obj.image
          ? `${mediaRoot}/img/backgrounds/${obj.image}`
          : null
        return finalURL
      },
      thumbnailURL: (thumbnailURL, obj) => {
        const finalURL = obj.thumbnail
          ? `${mediaRoot}/img/background-thumbnails/${obj.thumbnail}`
          : null
        return finalURL
      },
    }
  }
}

BackgroundImage.register()

export default BackgroundImage
