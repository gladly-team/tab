/* eslint-env jest */

describe('constructExperimentActionsType', () => {
  it('returns the expected value for referralNotification', () => {
    const constructExperimentActionsType = require('../constructExperimentActionsType')
      .default
    expect(
      constructExperimentActionsType({
        testReferralNotificationAction: 2,
      })
    ).toMatchObject({
      referralNotification: 2,
    })
  })

  it('returns the expected value for searchIntro', () => {
    const constructExperimentActionsType = require('../constructExperimentActionsType')
      .default
    expect(
      constructExperimentActionsType({
        testSearchIntroAction: 2,
      })
    ).toMatchObject({
      searchIntro: 2,
    })
  })
})
