import moment from 'moment'
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { VIDEO_AD_LOG } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class VideoAdLog extends BaseModel {
  static get name() {
    return VIDEO_AD_LOG
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'timestamp'
  }

  static get indexes() {
    return [
      {
        hashKey: 'id',
        name: 'VideoAdLogsByUniqueId',
        type: 'global',
      },
      {
        hashKey: 'truexEngagementId',
        name: 'VideoAdLogsByEngagementId',
        type: 'global',
      },
    ]
  }

  static get tableName() {
    return tableNames.videoAdLog
  }

  static get schema() {
    const self = this
    return {
      userId: types
        .string()
        .required()
        .description(
          `The unique user ID from our authentication service (Firebase)`
        ),
      timestamp: types
        .string()
        .isoDate()
        .default(self.fieldDefaults.timestamp)
        .description(`time of creation`)
        .required(),
      completed: types
        .boolean()
        .default(self.fieldDefaults.completed)
        .description('user completed ad engagement and is credited'),
      id: types
        .uuid()
        .required()
        .description(`The unique item id`),
      truexEngagementId: types
        .string()
        .default(self.fieldDefaults.truexEngagementId)
        .description('the truex engagement "key" field'),
      truexCreativeId: types
        .string()
        .default(self.fieldDefaults.truexCreativeId)
        .description('true[X] engagement “ad.creative_id” field'),
    }
  }

  static get fieldDefaults() {
    return {
      completed: false,
      timestamp: moment.utc().toISOString(),
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      update: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey,
      query: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

VideoAdLog.register()

export default VideoAdLog
