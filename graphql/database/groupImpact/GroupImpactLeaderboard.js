import { CAUSE_GROUP_IMPACT_LEADERBOARD } from '../constants'

// Upstash-backed Group Impact leaderboard is disabled.
//
// All reads return an empty leaderboard and all writes are no-ops so no new
// keys (CauseGroupImpactLeaderboard_*) are created in Upstash. The class
// interface is preserved so callers compile and run unchanged.
class GroupImpactLeaderboard {
  // Name is preserved for any external code / logs that read it.
  static get name() {
    return CAUSE_GROUP_IMPACT_LEADERBOARD
  }

  // Intentionally unused; no real Upstash client is instantiated while the
  // leaderboard is disabled.
  static getClient() {
    return null
  }

  // Write: adds a user's contribution to the leaderboard sorted set. Disabled
  // so nothing is persisted.
  static async add() {
    // no-op
  }

  // Read: returns the leaderboard entries surrounding a given user. With the
  // leaderboard disabled we return an empty list; the GraphQL resolver and
  // frontend already handle the empty-list case.
  static async getLeaderboardForUser() {
    return []
  }

  // Preserved so test utilities that reference the Upstash key format still
  // resolve. Not used against real Upstash anymore.
  static getRedisKey(hashKey) {
    return `${this.name}_${hashKey}`
  }
}

export default GroupImpactLeaderboard
