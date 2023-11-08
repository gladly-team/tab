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
    // This will fail if redis does not have data.
    try {
      const userGroupImpactMetricModel = await UserGroupImpactMetricModel.get(
        groupImpactOverride,
        userGroupImpactMetricId
      )

      const redisClient = this.getClient()
      const redisKey = this.getRedisKey(
        userGroupImpactMetricModel.groupImpactMetricId
      )

      // Get Top 3 users
      const topUsers = await redisClient.zrange(redisKey, 0, 2, { rev: true })
      // Get user's position
      const currentPosition = await redisClient.zrevrank(redisKey, userId)

      let nextUsers = []
      let userPositions = []

      // Get users around user

      if (currentPosition < 3) {
        // If user in top 3, just get next 3 users
        nextUsers = await redisClient.zrange(redisKey, 3, 5, { rev: true })
        for (let i = 0; i < nextUsers.length + topUsers.length; i += 1) {
          userPositions.push(i + 1)
        }
      } else {
        const lowerBound = Math.max(3, currentPosition - 1)
        nextUsers = await redisClient.zrange(
          redisKey,
          lowerBound,
          lowerBound + 2,
          { rev: true }
        )
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

      const potentialUsers = [...topUsers, ...nextUsers]
      // Safety check to ensure we don't fetch duplicate users
      const [dedupedUsers, dedupedUserPositions] = this.removeDuplicates(
        potentialUsers,
        userPositions
      )
      const userModels = await UserModel.getBatchInOrder(
        groupImpactOverride,
        dedupedUsers
      )
      const userGroupImpactModels = await this.fetchGroupImpactMetricModels(
        userModels
      )

      return dedupedUserPositions
        .map((element, index) => ({
          user: userModels[index],
          position: element,
          userGroupImpactMetric: userGroupImpactModels[index],
        }))
        .filter((elem) => elem.user && elem.userGroupImpactMetric)
    } catch (e) {
      return []
    }
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

  static removeDuplicates(listA, listB) {
    const seen = {}
    const deduplicatedListA = []
    const deduplicatedListB = []

    for (let i = 0; i < listA.length; i += 1) {
      const currentItem = listA[i]

      if (!seen[currentItem]) {
        deduplicatedListA.push(currentItem)
        deduplicatedListB.push(listB[i])
        seen[currentItem] = true
      }
    }

    return [deduplicatedListA, deduplicatedListB]
  }
}

export default GroupImpactLeaderboard
