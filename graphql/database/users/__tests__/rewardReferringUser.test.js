/* eslint-env jest */

import UserModel from '../UserModel'
import rewardReferringUser from '../rewardReferringUser'
import addVc from '../addVc'
import addUsersRecruited from '../addUsersRecruited'

jest.mock('../../databaseClient')
jest.mock('../addVc')
jest.mock('../addUsersRecruited')

// Mock addVc method
UserModel.addVc = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

describe('rewardReferringUser', () => {
  it('gives the referring user VC as expected', async () => {
    const referringUserId = 'some-id-123'
    await rewardReferringUser(referringUserId)
    const addVcCallParams = addVc.mock.calls[0]
    expect(addVcCallParams[0]).toMatch(/REWARD_REFERRER_OVERRIDE_CONFIRMED_[0-9]{5}$/)
    expect(addVcCallParams[1]).toBe(referringUserId)
    expect(addVcCallParams[2]).toBe(350)
  })

  it('calls to increment the referring user\'s number of recruited users', async () => {
    const referringUserId = 'some-id-123'
    await rewardReferringUser(referringUserId)
    expect(addUsersRecruited).toHaveBeenCalledWith(referringUserId, 1)
    expect(addUsersRecruited).toHaveBeenCalledTimes(1)
  })
})
