/* eslint-env jest */
/* globals jasmine */

import { getDriver } from '../utils/driver-mgr'

let driver
afterEach(() => {
  if (driver && driver.quit) {
    return driver.quit()
  }
})

const testTimeout = 70e3
jasmine.DEFAULT_TIMEOUT_INTERVAL = testTimeout

// Sanity checking that the app deployed and loads correctly
describe('Tab: acceptance tests', () => {
  it(
    'should load the auth page',
    async () => {
      driver = getDriver('Tab: acceptance tests: should load auth page')
      await driver.navigateTo('/newtab/')
      await driver.waitForElementExistsByTestId('authentication-page')
    },
    testTimeout
  )

  it(
    'should go to the new tab dashboard after signing in',
    async () => {
      driver = getDriver(
        'Tab: acceptance tests: should go to the new tab dashboard after signing in'
      )
      await driver.navigateTo('/newtab/') // this should redirect to the auth page
      await driver.waitForElementExistsByTestId('authentication-page')
      await driver.signIn()
      await driver.waitForElementExistsByTestId('app-dashboard')
    },
    testTimeout
  )
})
