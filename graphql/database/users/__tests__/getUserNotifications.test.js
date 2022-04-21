/* eslint-env jest */

import getUserNotifications from '../getUserNotifications'
import { getMockUserContext, getMockUserInstance } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'

jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('getUserNotifications', () => {
  it('returns the expected notifications data (no user survey feature enabled)', async () => {
    expect.assertions(1)
    getUserFeature.mockResolvedValue({
      featureName: 'user-survey-2022-notification',
      variation: false,
    })
    const notifications = await getUserNotifications(userContext, user)
    expect(notifications).toEqual([])
  })

  it('returns the expected notifications data (user survey feature enabled)', async () => {
    expect.assertions(1)
    getUserFeature.mockResolvedValue({
      featureName: 'user-survey-2022-notification',
      variation: true,
    })
    const notifications = await getUserNotifications(userContext, user)
    expect(notifications).toEqual([{ code: 'userSurvey2022' }])
  })
})
