// eslint-disable-next-line import/no-unresolved
import { Redis } from '@upstash/redis/with-fetch'
import { CAUSE_GROUP_IMPACT_LEADERBOARD } from '../constants'
import config from '../../config'
import UserModel from '../users/UserModel'
import UserGroupImpactMetricModel from './UserGroupImpactMetricModel'
import {
  GROUP_IMPACT_OVERRIDE,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'

const groupImpactOverride = getPermissionsOverride(GROUP_IMPACT_OVERRIDE)

class GroupImpactLeaderboard {
  static get name() {
    return CAUSE_GROUP_IMPACT_LEADERBOARD
  }

  static getClient() {
    const client = new Redis({
      url: config.UPSTASH_REDIS_REST_URL,
      token: config.UPSTASH_REDIS_REST_TOKEN,
    })

    return client
  }

  static async add(groupImpactId, userId, contribution) {
    const redisClient = this.getClient()
    const redisKey = this.getRedisKey(groupImpactId)

    return redisClient.zadd(redisKey, { member: userId, score: contribution })
  }

  static async getLeaderboardForUser(userGroupImpactMetricId, userId) {
    const userGroupImpactMetricModel = await UserGroupImpactMetricModel.get(
      groupImpactOverride,
      userGroupImpactMetricId
    )
    const redisClient = this.getClient()
    const redisKey = this.getRedisKey(
      userGroupImpactMetricModel.groupImpactMetricId
    )

    // Get Top 3 users
    const topUsers = (await redisClient.zrange(redisKey, -3, -1)).reverse()

    // Get user's position
    const currentPosition = await redisClient.zrank(redisKey, userId)
    let nextUsers
    let userPositions
    // Get users around user
    if (currentPosition < 3) {
      // If user in top 3, just get next 3 users
      nextUsers = await redisClient.zrange(redisKey, 3, 5)
      userPositions = [1, 2, 3, 4, 5, 6]
    } else {
      const lowerBound = Math.max(3, currentPosition - 1)
      nextUsers = await redisClient.zrange(redisKey, lowerBound, lowerBound + 2)
      if (nextUsers.length === 1) {
        userPositions = [1, 2, 3, lowerBound + 1]
      } else if (nextUsers.length === 2) {
        userPositions = [1, 2, 3, lowerBound + 1, lowerBound + 2]
      } else if (nextUsers.length === 3)
        userPositions = [
          1,
          2,
          3,
          lowerBound + 1,
          lowerBound + 2,
          lowerBound + 3,
        ]
    }

    const userModels = await UserModel.getBatchInOrder(groupImpactOverride, [
      ...topUsers,
      ...nextUsers,
    ])
    const userGroupImpactModels = await this.fetchGroupImpactMetricModels(
      userModels
    )
    return userPositions.map((element, index) => ({
      user: userModels[index],
      position: element,
      userGroupImpactMetric: userGroupImpactModels[index],
    }))
  }

  static async fetchGroupImpactMetricModels(userModels) {
    const userGroupImpactMetricIds = userModels
      .filter((element) => element) // TODO(spicer): figure out why some elements are undefined
      .map((User) => User.userGroupImpactMetricId)

    return UserGroupImpactMetricModel.getBatch(
      groupImpactOverride,
      userGroupImpactMetricIds
    )
  }

  static getRedisKey(hashKey) {
    return `${this.name}_${hashKey}`
  }
}

export default GroupImpactLeaderboard
