/* eslint-env jest */

const adSettings = jest.genMockFromModule('../adSettings')
adSettings.AUCTION_TIMEOUT = 1000
adSettings.CONSENT_MANAGEMENT_TIMEOUT = 50
adSettings.BIDDER_TIMEOUT = 700

module.exports = adSettings
