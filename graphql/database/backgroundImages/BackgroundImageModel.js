
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { BACKGROUND_IMAGE } from '../constants'
import config from '../../config'

const mediaRoot = config.S3_ENDPOINT

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
      image: types.string(),
      thumbnail: types.string()
    }
  }

  static get permissions () {
    return {
      get: () => true,
      getAll: () => true
    }
  }

  static get fieldDeserializers () {
    return {
      image: (image) => {
        // Add the media path to the image.
        return `${mediaRoot}/img/backgrounds/${image}`
      },
      thumbnail: (thumbnail) => {
        return `${mediaRoot}/img/background-thumbnails/${thumbnail}`
      }
    }
  }
}

BackgroundImage.register()

export default BackgroundImage
