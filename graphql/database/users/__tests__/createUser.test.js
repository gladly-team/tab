/* eslint-env jest */

import UserModel from '../UserModel'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

import { logReferralData } from '../../referrals/referralData'
import rewardReferringUser from '../rewardReferringUser'

jest.mock('../../referrals/referralData')
jest.mock('../rewardReferringUser')

mockQueryMethods(UserModel)
const userContext = getMockUserObj()

beforeEach(() => {
  UserModel.getUserByUsername = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('createUser', () => {
  it('works as expected without referralData', async () => {
    const user = {
      id: 'abcdefgh-151a-4a9a-9289-06906670fd4e',
      username: 'SomeName',
      email: 'foo@bar.com'
    }
    const referralData = null
    await UserModel.createUser(userContext, user.id,
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
    UserModel.getUserByUsername = jest.fn(() => ({
      id: referringUserId
    }))

    await UserModel.createUser(userContext, user.id,
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
    UserModel.getUserByUsername = jest.fn(() => null)

    await UserModel.createUser(userContext, user.id,
      user.username, user.email, referralData)
    expect(UserModel.create)
      .toHaveBeenCalledWith(userContext, user)
    expect(logReferralData).not.toHaveBeenCalled()
    expect(rewardReferringUser).not.toHaveBeenCalled()
  })
})
