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
describe('Basic integration tests', () => {
  it('should load the auth page', async () => {
    driver = getDriver('Basic integration tests: should load auth page')
    await driver.navigateTo('/newtab/')
    await driver.waitForElementExistsByTestId('authentication-page')
  }, 30e3)

  it('should sign in', async () => {
    driver = getDriver('Basic integration tests: should sign in')
    await driver.signIn()
  }, 30e3)
})
