/* eslint-env jest */
/* globals jasmine */

import { getDriver } from '../utils/driver-mgr'

let driver
afterEach(() => {
  if (driver && driver.quit) {
    return driver.quit()
  }
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 35e3

// Sanity checking that the app deployed and loads correctly
describe('Tab: acceptance tests', () => {
  it('should load the auth page', async () => {
    driver = getDriver('Tab: acceptance tests: should load auth page')
    await driver.navigateTo('/newtab/')
    await driver.waitForElementExistsByTestId('authentication-page')
  }, 30e3)

  it('should go to the new tab dashboard after signing in', async () => {
    driver = getDriver(
      'Tab: acceptance tests: should go to the new tab dashboard after signing in'
    )
    await driver.navigateTo('/newtab/') // this should redirect to the auth page
    await driver.waitForElementExistsByTestId('authentication-page')
    await driver.signIn()
    await driver.waitForElementExistsByTestId('app-dashboard')
  }, 30e3)
})
