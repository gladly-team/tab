import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_MISSION } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class VideoAdLog extends BaseModel {
  static get name() {
    return USER_MISSION
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
        name: 'logsByUniqueId',
        type: 'global',
      },
      {
        hashKey: 'truexEngagementId',
        name: 'logsByEngagementId',
        type: 'global',
      },
    ]
  }

  static get tableName() {
    return tableNames.VideoAdLog
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
        .description(`time of creation`)
        .required(),
      completed: types
        .boolean()
        .default(self.fieldDefaults.completed)
        .description('user has aknowledged that the mission has completed'),
      id: types
        .string()
        .length(9)
        .required()
        .description(`The unique item id`),
      truexEngagementId: types
        .string()
        .default(self.fieldDefaults.truexEngagementId)
        .description('the truex engagement "key" field'),
      truexCreativeId: types.string
        .default(self.fieldDefaults.truexCreativeId)
        .description('true[X] engagement “ad.creative_id” field'),
    }
  }

  static get fieldDefaults() {
    return {
      truexEngagementId: null,
      truexCreativeId: null,
      completed: false,
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      update: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey,
      query: permissionAuthorizers.userIdMatchesHashKey,
      indexPermissions: {
        userMissionsByDate: {
          get: permissionAuthorizers.userIdMatchesRangeKey,
          getAll: permissionAuthorizers.userIdMatchesRangeKey,
          query: permissionAuthorizers.userIdMatchesRangeKey,
        },
      },
    }
  }
}

VideoAdLog.register()

export default VideoAdLog
