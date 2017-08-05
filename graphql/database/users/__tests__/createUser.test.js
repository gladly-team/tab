/* eslint-env jest */

import UserModel from '../UserModel'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

jest.mock('../../referrals/referralData')
jest.mock('../rewardReferringUser')
jest.mock('../getUserByUsername')

mockQueryMethods(UserModel)
const userContext = getMockUserObj()

afterEach(() => {
  jest.resetModules()
})

describe('createUser', () => {
  it('works as expected without referralData', async () => {
    const user = {
      id: 'abcdefgh-151a-4a9a-9289-06906670fd4e',
      username: 'SomeName',
      email: 'foo@bar.com'
    }
    const referralData = null

    const createUser = require('../createUser').default
    const logReferralData = require('../../referrals/referralData').logReferralData
    const rewardReferringUser = require('../rewardReferringUser').default

    await createUser(userContext, user.id,
      user.username, user.email, referralData)
    expect(UserModel.create)
      .toHaveBeenCalledWith(userContext, user)
    expect(logReferralData).not.toHaveBeenCalled()
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })

  it('logs referral data and rewards referring user', async () => {
    const thisUserId = 'abcdefgh-151a-4a9a-9289-06906670fd4e'
    const user = {
      id: thisUserId,
      username: 'SomeName',
      email: 'foo@bar.com'
    }
    const referralData = {
      referringUser: 'FriendOfMine'
    }

    // Mock fetching the referring user.
    const referringUserId = 'ppooiiuu-151a-4a9a-9289-06906670fd4e'
    jest.mock('../getUserByUsername', () => {
      return () => ({
        id: 'ppooiiuu-151a-4a9a-9289-06906670fd4e'
      })
    })

    const createUser = require('../createUser').default
    const logReferralData = require('../../referrals/referralData').logReferralData
    const rewardReferringUser = require('../rewardReferringUser').default

    await createUser(userContext, user.id,
      user.username, user.email, referralData)
    expect(UserModel.create)
      .toHaveBeenCalledWith(userContext, user)
    expect(logReferralData)
      .toHaveBeenCalledWith(thisUserId, referringUserId)
    expect(rewardReferringUser)
      .toHaveBeenCalledWith(referringUserId)
  })

  it('works when referring user does not exist', async () => {
    const thisUserId = 'abcdefgh-151a-4a9a-9289-06906670fd4e'
    const user = {
      id: thisUserId,
      username: 'SomeName',
      email: 'foo@bar.com'
    }
    const referralData = {
      referringUser: 'FriendOfMine'
    }

    // Mock fetching the referring user.
    jest.mock('../getUserByUsername', () => {
      return () => null
    })

    const createUser = require('../createUser').default
    const logReferralData = require('../../referrals/referralData').logReferralData
    const rewardReferringUser = require('../rewardReferringUser').default

    await createUser(userContext, user.id,
      user.username, user.email, referralData)
    expect(UserModel.create)
      .toHaveBeenCalledWith(userContext, user)
    expect(logReferralData).not.toHaveBeenCalled()
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })
})
