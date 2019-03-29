/* eslint-env jest */
/* globals jasmine */

import driverUtils from '../utils/driver-utils'
import { getDriver, getAppBaseUrl } from '../utils/driver-mgr'

let driver
afterEach(() => {
  if (driver && driver.quit) {
    return driver.quit()
  }
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 35e3

const getAbsoluteUrl = relativeUrl => {
  return `${getAppBaseUrl()}${relativeUrl}`
}

// Sanity checking that the app deployed and loads correctly
describe('Search basic integration tests', () => {
  it('should load search page', async () => {
    driver = getDriver(
      'Search basic integration tests: should load search page'
    )
    await driverUtils(driver).navigateTo(getAbsoluteUrl('/search/?q=hi%there!'))
    await driverUtils(driver).waitForElementExistsByTestId('search-page')
  }, 30e3)
})
