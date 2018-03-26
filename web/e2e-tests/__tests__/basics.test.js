/* eslint-env jest */
/* globals jasmine */

import driverUtils from '../utils/driver-utils'
import { getDriver, getAppBaseUrl } from '../utils/driver-mgr'

let driver
afterEach(() => {
  return driver.quit()
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 35e3

// Sanity checking that the app deployed and loads correctly
describe('Basic integration tests', () => {
  it('should load the auth page', async () => {
    driver = getDriver('Basic integration tests: should load auth page')
    await driverUtils(driver).navigateTo(getAppBaseUrl())
    await driverUtils(driver).waitForElementExistsByTestId('authentication-page')
  }, 30e3)
})
