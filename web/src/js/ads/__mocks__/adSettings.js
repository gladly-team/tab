/* eslint-env jest */

const adSettings = jest.genMockFromModule('../adSettings')
adSettings.AUCTION_TIMEOUT = 1000
adSettings.CONSENT_MANAGEMENT_TIMEOUT = 50
adSettings.BIDDER_TIMEOUT = 700
adSettings.VERTICAL_AD_ID = '/11223344/HBTR'
adSettings.VERTICAL_AD_SLOT_ID = 'div-gpt-ad-1357913579-0'
adSettings.HORIZONTAL_AD_ID = '/99887766/HBTL'
adSettings.HORIZONTAL_AD_SLOT_ID = 'div-gpt-ad-24682468-0'

adSettings.getVerticalAdSizes = jest.fn(() => [[300, 250]])
adSettings.getHorizontalAdSizes = jest.fn(() => [[728, 90]])

module.exports = adSettings
