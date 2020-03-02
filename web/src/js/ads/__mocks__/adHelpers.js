/* eslint-env jest */

const adHelpers = jest.genMockFromModule('../adHelpers')

adHelpers.VERTICAL_AD_UNIT_ID = '/11223344/HBTR'
adHelpers.VERTICAL_AD_SLOT_DOM_ID = 'div-gpt-ad-1357913579-0'
adHelpers.SECOND_VERTICAL_AD_UNIT_ID = '/44556677/HBTR2'
adHelpers.SECOND_VERTICAL_AD_SLOT_DOM_ID = 'div-gpt-ad-11235813-0'
adHelpers.HORIZONTAL_AD_UNIT_ID = '/99887766/HBTL'
adHelpers.HORIZONTAL_AD_SLOT_DOM_ID = 'div-gpt-ad-24682468-0'

adHelpers.areAdsEnabled = jest.fn(() => false)
adHelpers.shouldShowAdExplanation = jest.fn(() => false)
adHelpers.getNumberOfAdsToShow = jest.fn(() => 3)

module.exports = adHelpers
