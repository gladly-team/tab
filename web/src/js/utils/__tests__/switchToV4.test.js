/* eslint-env jest */

import SetV4BetaMutation from 'js/mutations/SetV4BetaMutation'
import optIntoV4Beta from 'js/utils/v4-beta-opt-in'
import { flushAllPromises } from 'js/utils/test-utils'
import { reloadDashboard } from 'js/navigation/navigation'
import SetUserCauseMutation from 'js/mutations/SetUserCauseMutation'

//
jest.mock('js/utils/v4-beta-opt-in')
jest.mock('js/mutations/SetV4BetaMutation')
jest.mock('js/navigation/navigation', () => ({ reloadDashboard: jest.fn() }))
jest.mock('js/mutations/SetBackgroundDailyImageMutation')
jest.mock('js/mutations/SetUserCauseMutation')

describe('Switch to V4 function', () => {
  it('opts user into v4 and sets the new cause on click', async () => {
    expect.assertions(4)
    const switchToV4 = require('js/utils/switchToV4').default
    switchToV4({
      relayEnvironment: {},
      userId: 'abc123',
      causeId: 'fake-cause-id-1',
    })
    await flushAllPromises()
    expect(SetV4BetaMutation).toHaveBeenCalled()
    expect(SetUserCauseMutation).toHaveBeenCalledWith(
      expect.any(Object),
      'abc123',
      'fake-cause-id-1'
    )
    expect(optIntoV4Beta).toHaveBeenCalled()
    expect(reloadDashboard).toHaveBeenCalled()
  })
})
