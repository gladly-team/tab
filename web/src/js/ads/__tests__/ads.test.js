/* eslint-env jest */
import {
  getDefaultTabGlobal
} from 'utils/test-utils'
import getGoogleTag from '../google/getGoogleTag'
import getAmazonTag from '../amazon/getAmazonTag'

jest.mock('../google/getGoogleTag')
jest.mock('../amazon/getAmazonTag')
jest.mock('../adsEnabledStatus')
jest.mock('../prebid/prebidConfig')
jest.mock('../prebid/prebidModule')
jest.mock('../amazon/amazonBidder')
jest.mock('utils/client-location')

beforeEach(() => {
  // Mock apstag
  delete window.apstag
  window.apstag = getAmazonTag()

  // Mock tabforacause global
  window.tabforacause = getDefaultTabGlobal()

  // Set up googletag
  delete window.googletag
  window.googletag = getGoogleTag()

  jest.resetModules()
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  delete window.googletag
  delete window.apstag
  delete window.tabforacause
})

// TODO: tests
describe('ads script', function () {
  it('is a placeholder test', () => {
    expect(true).toBe(true)
  })
})
