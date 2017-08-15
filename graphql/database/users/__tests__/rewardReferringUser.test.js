/* eslint-env jest */

import UserModel from '../UserModel'
import rewardReferringUser from '../rewardReferringUser'
import addVc from '../addVc'

jest.mock('../../databaseClient')
jest.mock('../addVc')

// Mock addVc method
UserModel.addVc = jest.fn()

describe('rewardReferringUser', () => {
  it('works as expected', async () => {
    const referringUserId = 'some-id-123'
    await rewardReferringUser(referringUserId)
    const addVcCallParams = addVc.mock.calls[0]
    expect(addVcCallParams[0]).toMatch(/REWARD_REFERRER_OVERRIDE_CONFIRMED_[0-9]{5}$/)
    expect(addVcCallParams[1]).toBe(referringUserId)
    expect(addVcCallParams[2]).toBe(350)
  })
})
