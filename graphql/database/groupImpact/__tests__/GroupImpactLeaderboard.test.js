/* eslint-env jest */

import RedisModel from '../../base/RedisModel'
import GroupImpactLeaderboard from '../GroupImpactLeaderboard'

let client

beforeAll(() => {
  client = RedisModel.getClient()
})

afterEach(async () => {
  client.clear()
})

describe('GroupImpactLeaderboard entity', () => {
  it('Add inserts into redis client', async () => {
    const val = 5
    GroupImpactLeaderboard.add('key', 'entity', val)

    expect(await GroupImpactLeaderboard.add('key', 'entity', val)).toEqual(1)
    expect(
      client.fetchRawObject(GroupImpactLeaderboard.getRedisKey('key'))
    ).toEqual({
      entity: val,
    })
  })
})
