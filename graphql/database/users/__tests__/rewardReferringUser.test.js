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
    const overrideVal = 'PLACEHOLDER'
    await rewardReferringUser(referringUserId)
    expect(addVc).toHaveBeenCalledWith(overrideVal,
      referringUserId, 350)
  })
})
