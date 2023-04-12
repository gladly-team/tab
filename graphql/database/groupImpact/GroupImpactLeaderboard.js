// eslint-disable-next-line import/no-unresolved
import { Redis } from '@upstash/redis/with-fetch'
import { CAUSE_GROUP_IMPACT_LEADERBOARD } from '../constants'
import config from '../../config'

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

  static getRedisKey(hashKey) {
    return `${this.name}_${hashKey}`
  }
}

export default GroupImpactLeaderboard
