/* eslint-env jest */
/* globals jasmine */

// import driverUtils from '../utils/driver-utils'
// import {
//   getDriver,
//   getAppBaseUrl
// } from '../utils/driver-mgr'

let driver
afterEach(() => {
  if (driver && driver.quit) {
    return driver.quit()
  }
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 35e3

// const getAbsoluteUrl = (relativeUrl) => {
//   return `${getAppBaseUrl()}${relativeUrl}`
// }

// Sanity checking that the app deployed and loads correctly
describe('Basic integration tests', () => {
  // @experiment-anon-sign-in
  // TODO: re-enable after completing the anonymous sign-in experiement.
  //   The random split-test will break this test.

  // it('should load the auth page', async () => {
  //   driver = getDriver('Basic integration tests: should load auth page')
  //   await driverUtils(driver).navigateTo(getAbsoluteUrl('/newtab/'))
  //   await driverUtils(driver).waitForElementExistsByTestId('authentication-page')
  // }, 30e3)

  it('should pass this placeholder test', () => {
    expect(true).toBe(true)
  })
})
