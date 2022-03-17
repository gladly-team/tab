/* eslint-env jest */
import { YAHOO_SEARCH_EXISTING_USERS } from '../../experiments/experimentConstants'
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import Feature from '../../experiments/FeatureModel'

jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('shouldShowYahooPrompt tests', () => {
  it('returns false if user has seen yahoo prompt', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: YAHOO_SEARCH_EXISTING_USERS,
        variation: true,
      })
    )
    const seenPromptUser = {
      ...user,
      yahooSwitchSearchPrompt: true,
    }

    const result = await getShouldShowYahooPrompt(userContext, seenPromptUser)
    expect(result).toEqual(false)
  })
})
