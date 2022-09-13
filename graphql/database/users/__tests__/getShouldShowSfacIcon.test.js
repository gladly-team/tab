/* eslint-env jest */
import {
  SFAC_EXISTING_USER_ACTIVITY_ICON,
  SFAC_EXTENSION_PROMPT,
} from '../../experiments/experimentConstants'
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import Feature from '../../experiments/FeatureModel'

jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = getMockUserInstance()

beforeEach(() => {
  jest.resetModules()
})

describe('getShouldShowSfacIcon tests', () => {
  it('returns true if the user is in the treatment group for the "new user SFAC notification" experiment', async () => {
    expect.assertions(1)

    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === SFAC_EXTENSION_PROMPT) {
        return new Feature({
          featureName: SFAC_EXTENSION_PROMPT,
          variation: 'Notification',
        })
      }
      return new Feature()
    })

    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(true)
  })

  it('returns false if the user is in the control group for the "new user SFAC notification" experiment', async () => {
    expect.assertions(1)

    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === SFAC_EXTENSION_PROMPT) {
        return new Feature({
          featureName: SFAC_EXTENSION_PROMPT,
          variation: 'Control',
        })
      }
      return new Feature()
    })

    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(false)
  })

  it('returns true if the user is in the treatment group for the "existing user activity icon" experiment', async () => {
    expect.assertions(1)

    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === SFAC_EXISTING_USER_ACTIVITY_ICON) {
        return new Feature({
          featureName: SFAC_EXISTING_USER_ACTIVITY_ICON,
          variation: 'Icon',
        })
      }
      return new Feature()
    })

    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(true)
  })

  it('returns false if the user is in the control group for the "existing user activity icon" experiment', async () => {
    expect.assertions(1)

    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === SFAC_EXISTING_USER_ACTIVITY_ICON) {
        return new Feature({
          featureName: SFAC_EXISTING_USER_ACTIVITY_ICON,
          variation: 'Control',
        })
      }
      return new Feature()
    })

    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(false)
  })

  it('returns true if the user is in the treatment group for the "new user SFAC notification" experiment but in the control group for the "existing user activity icon" experiment', async () => {
    expect.assertions(1)

    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockImplementation((_userContext, _user, featureName) => {
      if (featureName === SFAC_EXTENSION_PROMPT) {
        return new Feature({
          featureName: SFAC_EXTENSION_PROMPT,
          variation: 'Notification',
        })
      }
      if (featureName === SFAC_EXISTING_USER_ACTIVITY_ICON) {
        return new Feature({
          featureName: SFAC_EXISTING_USER_ACTIVITY_ICON,
          variation: 'Control',
        })
      }
      return new Feature()
    })

    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(true)
  })
})
