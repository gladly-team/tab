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

  it('leaderboard works happy case', async () => {
    await GroupImpactLeaderboard.add('key', 'entity4', 4)
    await GroupImpactLeaderboard.add('key', 'entity5', 3)
    await GroupImpactLeaderboard.add('key', 'entity6', 2)
    await GroupImpactLeaderboard.add('key', 'entity7', 1)
    await GroupImpactLeaderboard.add('key', 'entity1', 9)
    await GroupImpactLeaderboard.add('key', 'entity2', 7)
    await GroupImpactLeaderboard.add('key', 'entity3', 5)

    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'getBatch').mockImplementation((_, ids) => {
      expect(ids).toEqual([
        'entity1',
        'entity2',
        'entity3',
        'entity5',
        'entity6',
        'entity7',
      ])
      return [
        { id: 'entity1', userGroupImpactMetricId: 'entity1u' },
        { id: 'entity2', userGroupImpactMetricId: 'entity2u' },
        { id: 'entity3', userGroupImpactMetricId: 'entity3u' },
        { id: 'entity5', userGroupImpactMetricId: 'entity5u' },
        { id: 'entity6', userGroupImpactMetricId: 'entity6u' },
        { id: 'entity7', userGroupImpactMetricId: 'entity7u' },
      ]
    })

    const batchOfModels = [
      { id: 'entity1u' },
      { id: 'entity2u' },
      { id: 'entity3u' },
      { id: 'entity5u' },
      { id: 'entity6u' },
      { id: 'entity7u' },
    ]
    const UserGroupImpactMetricModel =
      require('../../groupImpact/UserGroupImpactMetricModel').default
    jest
      .spyOn(UserGroupImpactMetricModel, 'getBatch')
      .mockImplementation((_, ids) => {
        expect(ids).toEqual([
          'entity1u',
          'entity2u',
          'entity3u',
          'entity5u',
          'entity6u',
          'entity7u',
        ])
        return batchOfModels
      })

    expect(
      await GroupImpactLeaderboard.getLeaderboardForUser('key', 'entity6')
    ).toEqual([
      { position: 1, userGroupImpactMetric: batchOfModels[0] },
      { position: 2, userGroupImpactMetric: batchOfModels[1] },
      { position: 3, userGroupImpactMetric: batchOfModels[2] },
      { position: 5, userGroupImpactMetric: batchOfModels[3] },
      { position: 6, userGroupImpactMetric: batchOfModels[4] },
      { position: 7, userGroupImpactMetric: batchOfModels[5] },
    ])
  })

  it('leaderboard works top 6', async () => {
    await GroupImpactLeaderboard.add('key', 'entity4', 4)
    await GroupImpactLeaderboard.add('key', 'entity5', 3)
    await GroupImpactLeaderboard.add('key', 'entity6', 2)
    await GroupImpactLeaderboard.add('key', 'entity7', 1)
    await GroupImpactLeaderboard.add('key', 'entity1', 9)
    await GroupImpactLeaderboard.add('key', 'entity2', 7)
    await GroupImpactLeaderboard.add('key', 'entity3', 5)

    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'getBatch').mockImplementation((_, ids) => {
      expect(ids).toEqual([
        'entity1',
        'entity2',
        'entity3',
        'entity4',
        'entity5',
        'entity6',
      ])
      return [
        { id: 'entity1', userGroupImpactMetricId: 'entity1u' },
        { id: 'entity2', userGroupImpactMetricId: 'entity2u' },
        { id: 'entity3', userGroupImpactMetricId: 'entity3u' },
        { id: 'entity5', userGroupImpactMetricId: 'entity5u' },
        { id: 'entity6', userGroupImpactMetricId: 'entity6u' },
        { id: 'entity7', userGroupImpactMetricId: 'entity7u' },
      ]
    })

    const batchOfModels = [
      { id: 'entity1u' },
      { id: 'entity2u' },
      { id: 'entity3u' },
      { id: 'entity5u' },
      { id: 'entity6u' },
      { id: 'entity7u' },
    ]
    const UserGroupImpactMetricModel =
      require('../../groupImpact/UserGroupImpactMetricModel').default
    jest
      .spyOn(UserGroupImpactMetricModel, 'getBatch')
      .mockImplementation((_, ids) => {
        expect(ids).toEqual([
          'entity1u',
          'entity2u',
          'entity3u',
          'entity5u',
          'entity6u',
          'entity7u',
        ])
        return batchOfModels
      })

    expect(
      await GroupImpactLeaderboard.getLeaderboardForUser('key', 'entity1')
    ).toEqual([
      { position: 1, userGroupImpactMetric: batchOfModels[0] },
      { position: 2, userGroupImpactMetric: batchOfModels[1] },
      { position: 3, userGroupImpactMetric: batchOfModels[2] },
      { position: 4, userGroupImpactMetric: batchOfModels[3] },
      { position: 5, userGroupImpactMetric: batchOfModels[4] },
      { position: 6, userGroupImpactMetric: batchOfModels[5] },
    ])
  })

  it('leaderboard works for last place', async () => {
    await GroupImpactLeaderboard.add('key', 'entity4', 4)
    await GroupImpactLeaderboard.add('key', 'entity5', 3)
    await GroupImpactLeaderboard.add('key', 'entity6', 2)
    await GroupImpactLeaderboard.add('key', 'entity7', 1)
    await GroupImpactLeaderboard.add('key', 'entity1', 9)
    await GroupImpactLeaderboard.add('key', 'entity2', 7)
    await GroupImpactLeaderboard.add('key', 'entity3', 5)

    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'getBatch').mockImplementation((_, ids) => {
      expect(ids).toEqual([
        'entity1',
        'entity2',
        'entity3',
        'entity6',
        'entity7',
      ])
      return [
        { id: 'entity1', userGroupImpactMetricId: 'entity1u' },
        { id: 'entity2', userGroupImpactMetricId: 'entity2u' },
        { id: 'entity3', userGroupImpactMetricId: 'entity3u' },
        { id: 'entity6', userGroupImpactMetricId: 'entity6u' },
        { id: 'entity7', userGroupImpactMetricId: 'entity7u' },
      ]
    })

    const batchOfModels = [
      { id: 'entity1u' },
      { id: 'entity2u' },
      { id: 'entity3u' },
      { id: 'entity6u' },
      { id: 'entity7u' },
    ]
    const UserGroupImpactMetricModel =
      require('../../groupImpact/UserGroupImpactMetricModel').default
    jest
      .spyOn(UserGroupImpactMetricModel, 'getBatch')
      .mockImplementation((_, ids) => {
        expect(ids).toEqual([
          'entity1u',
          'entity2u',
          'entity3u',
          'entity6u',
          'entity7u',
        ])
        return batchOfModels
      })

    expect(
      await GroupImpactLeaderboard.getLeaderboardForUser('key', 'entity7')
    ).toEqual([
      { position: 1, userGroupImpactMetric: batchOfModels[0] },
      { position: 2, userGroupImpactMetric: batchOfModels[1] },
      { position: 3, userGroupImpactMetric: batchOfModels[2] },
      { position: 6, userGroupImpactMetric: batchOfModels[3] },
      { position: 7, userGroupImpactMetric: batchOfModels[4] },
    ])
  })

  it('leaderboard works for 4th place', async () => {
    await GroupImpactLeaderboard.add('key', 'entity4', 4)
    await GroupImpactLeaderboard.add('key', 'entity5', 3)
    await GroupImpactLeaderboard.add('key', 'entity6', 2)
    await GroupImpactLeaderboard.add('key', 'entity7', 1)
    await GroupImpactLeaderboard.add('key', 'entity1', 9)
    await GroupImpactLeaderboard.add('key', 'entity2', 7)
    await GroupImpactLeaderboard.add('key', 'entity3', 5)

    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'getBatch').mockImplementation((_, ids) => {
      expect(ids).toEqual([
        'entity1',
        'entity2',
        'entity3',
        'entity4',
        'entity5',
        'entity6',
      ])
      return [
        { id: 'entity1', userGroupImpactMetricId: 'entity1u' },
        { id: 'entity2', userGroupImpactMetricId: 'entity2u' },
        { id: 'entity3', userGroupImpactMetricId: 'entity3u' },
        { id: 'entity4', userGroupImpactMetricId: 'entity4u' },
        { id: 'entity5', userGroupImpactMetricId: 'entity5u' },
        { id: 'entity6', userGroupImpactMetricId: 'entity6u' },
      ]
    })

    const batchOfModels = [
      { id: 'entity1u' },
      { id: 'entity2u' },
      { id: 'entity3u' },
      { id: 'entity4u' },
      { id: 'entity5u' },
      { id: 'entity6u' },
    ]
    const UserGroupImpactMetricModel =
      require('../../groupImpact/UserGroupImpactMetricModel').default
    jest
      .spyOn(UserGroupImpactMetricModel, 'getBatch')
      .mockImplementation((_, ids) => {
        expect(ids).toEqual([
          'entity1u',
          'entity2u',
          'entity3u',
          'entity4u',
          'entity5u',
          'entity6u',
        ])
        return batchOfModels
      })

    expect(
      await GroupImpactLeaderboard.getLeaderboardForUser('key', 'entity4')
    ).toEqual([
      { position: 1, userGroupImpactMetric: batchOfModels[0] },
      { position: 2, userGroupImpactMetric: batchOfModels[1] },
      { position: 3, userGroupImpactMetric: batchOfModels[2] },
      { position: 4, userGroupImpactMetric: batchOfModels[3] },
      { position: 5, userGroupImpactMetric: batchOfModels[4] },
      { position: 6, userGroupImpactMetric: batchOfModels[5] },
    ])
  })

  it('leaderboard works for 5 elements', async () => {
    await GroupImpactLeaderboard.add('key', 'entity4', 4)
    await GroupImpactLeaderboard.add('key', 'entity5', 3)
    await GroupImpactLeaderboard.add('key', 'entity1', 9)
    await GroupImpactLeaderboard.add('key', 'entity2', 7)
    await GroupImpactLeaderboard.add('key', 'entity3', 5)

    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'getBatch').mockImplementation((_, ids) => {
      expect(ids).toEqual([
        'entity1',
        'entity2',
        'entity3',
        'entity4',
        'entity5',
      ])
      return [
        { id: 'entity1', userGroupImpactMetricId: 'entity1u' },
        { id: 'entity2', userGroupImpactMetricId: 'entity2u' },
        { id: 'entity3', userGroupImpactMetricId: 'entity3u' },
        { id: 'entity4', userGroupImpactMetricId: 'entity4u' },
        { id: 'entity5', userGroupImpactMetricId: 'entity5u' },
      ]
    })

    const batchOfModels = [
      { id: 'entity1u' },
      { id: 'entity2u' },
      { id: 'entity3u' },
      { id: 'entity4u' },
      { id: 'entity5u' },
    ]
    const UserGroupImpactMetricModel =
      require('../../groupImpact/UserGroupImpactMetricModel').default
    jest
      .spyOn(UserGroupImpactMetricModel, 'getBatch')
      .mockImplementation((_, ids) => {
        expect(ids).toEqual([
          'entity1u',
          'entity2u',
          'entity3u',
          'entity4u',
          'entity5u',
        ])
        return batchOfModels
      })

    expect(
      await GroupImpactLeaderboard.getLeaderboardForUser('key', 'entity4')
    ).toEqual([
      { position: 1, userGroupImpactMetric: batchOfModels[0] },
      { position: 2, userGroupImpactMetric: batchOfModels[1] },
      { position: 3, userGroupImpactMetric: batchOfModels[2] },
      { position: 4, userGroupImpactMetric: batchOfModels[3] },
      { position: 5, userGroupImpactMetric: batchOfModels[4] },
    ])
  })

  it('leaderboard works for 4th place', async () => {
    await GroupImpactLeaderboard.add('key', 'entity4', 4)
    await GroupImpactLeaderboard.add('key', 'entity1', 9)
    await GroupImpactLeaderboard.add('key', 'entity2', 7)
    await GroupImpactLeaderboard.add('key', 'entity3', 5)

    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'getBatch').mockImplementation((_, ids) => {
      expect(ids).toEqual(['entity1', 'entity2', 'entity3', 'entity4'])
      return [
        { id: 'entity1', userGroupImpactMetricId: 'entity1u' },
        { id: 'entity2', userGroupImpactMetricId: 'entity2u' },
        { id: 'entity3', userGroupImpactMetricId: 'entity3u' },
        { id: 'entity4', userGroupImpactMetricId: 'entity4u' },
      ]
    })

    const batchOfModels = [
      { id: 'entity1u' },
      { id: 'entity2u' },
      { id: 'entity3u' },
      { id: 'entity4u' },
    ]
    const UserGroupImpactMetricModel =
      require('../../groupImpact/UserGroupImpactMetricModel').default
    jest
      .spyOn(UserGroupImpactMetricModel, 'getBatch')
      .mockImplementation((_, ids) => {
        expect(ids).toEqual(['entity1u', 'entity2u', 'entity3u', 'entity4u'])
        return batchOfModels
      })

    expect(
      await GroupImpactLeaderboard.getLeaderboardForUser('key', 'entity4')
    ).toEqual([
      { position: 1, userGroupImpactMetric: batchOfModels[0] },
      { position: 2, userGroupImpactMetric: batchOfModels[1] },
      { position: 3, userGroupImpactMetric: batchOfModels[2] },
      { position: 4, userGroupImpactMetric: batchOfModels[3] },
    ])
  })
})
