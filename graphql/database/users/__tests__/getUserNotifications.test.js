/* eslint-env jest */

import getUserNotifications from '../getUserNotifications'
import { getMockUserContext, getMockUserInstance } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import logger from '../../../utils/logger'

jest.mock('../../experiments/getUserFeature')
jest.mock('../../../utils/logger')

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

  it('logs an error and returns an empty array if something goes wrong', async () => {
    expect.assertions(2)
    getUserFeature.mockImplementationOnce(() => {
      throw new Error('Something went wrong.')
    })
    const notifications = await getUserNotifications(userContext, user)
    expect(logger.error).toHaveBeenCalledWith(
      new Error('Something went wrong.')
    )
    expect(notifications).toEqual([])
  })
})
