/* eslint-env jest */

import UserModel from '../UserModel'
import {
  mockQueryMethods
} from '../../test-utils'

mockQueryMethods(UserModel)

// Mock addVc method
UserModel.addVc = jest.fn()

describe('rewardReferringUser', () => {
  it('works as expected', async () => {
    const referringUserId = 'some-id-123'
    const overrideVal = 'PLACEHOLDER'
    await UserModel.rewardReferringUser(referringUserId)
    expect(UserModel.addVc).toHaveBeenCalledWith(overrideVal,
      referringUserId, 350)
  })
})
