/* eslint-env jest */

import { V4_SUPPORTING_STATEMENTS } from '../../experiments/experimentConstants'

import {
  getMockUserContext,
  getMockCauseInstance,
  getMockUserInstance,
} from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import Feature from '../../experiments/FeatureModel'

jest.mock('../../experiments/getUserFeature')

const cause = getMockCauseInstance()
const userContext = getMockUserContext()

const mockUser = getMockUserInstance({
  id: userContext.id,
  causeId: cause.id,
})

describe('getLandingPagePhrase tests', () => {
  const UserModel = require('../UserModel').default
  jest.spyOn(UserModel, 'get').mockResolvedValue(mockUser)

  it('returns control phrase', async () => {
    expect.assertions(1)
    const getLandingPagePhrase = require('../getLandingPagePhrase').default

    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: V4_SUPPORTING_STATEMENTS,
        variation: 'Control',
      })
    )

    const result = await getLandingPagePhrase(userContext, cause)
    expect(result).toEqual('Supporting: cause name')
  })

  it('returns experiment phrase', async () => {
    expect.assertions(1)
    const getLandingPagePhrase = require('../getLandingPagePhrase').default

    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: V4_SUPPORTING_STATEMENTS,
        variation: 'Experiment',
      })
    )

    const result = await getLandingPagePhrase(userContext, cause)
    expect(result).toEqual('test landing page phrase')
  })
})
