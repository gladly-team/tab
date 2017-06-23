/* eslint-env jest */

import { rewardReferringUser } from '../rewardReferringUser'
import { updateUserVc } from '../updateUserVc'

jest.mock('../../database')

jest.mock('../updateUserVc', () => {
  return {
    updateUserVc: jest.fn((userId, rewardVc) => {
      return Promise.resolve(true)
    })
  }
})

function setup () {
  jest.resetAllMocks()
}

describe('Reward Referring User tests', function () {
  it('should call to update the user vc', () => {
    setup()
    const referringUser = 'referring-user-id'
    const rewardVc = 350

    return rewardReferringUser(referringUser, rewardVc)
        .then(user => {
          const updateUserVcCalls = updateUserVc.mock.calls.length
          expect(updateUserVcCalls).toBe(1)

          const updateUserVcMock = updateUserVc.mock
                  .calls[updateUserVc.mock.calls.length - 1]

          expect(updateUserVcMock[0]).toBe(referringUser)
          expect(updateUserVcMock[1]).toBe(rewardVc)
        })
  })
})
