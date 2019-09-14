/* eslint-env jest */
/* globals jasmine */

import driverUtils from '../utils/driver-utils'
import { getDriver } from '../utils/driver-mgr'

// const webdriver = require('selenium-webdriver')
// const By = webdriver.By

let driver
afterEach(() => {
  if (driver && driver.quit) {
    return driver.quit()
  }
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 35e3

// Sanity checking that the app deployed and loads correctly
describe('Search basic integration tests', () => {
  it('should redirect to auth from search', async () => {
    driver = getDriver(
      'Search basic integration tests: should redirect to auth from search'
    )
    await driver.navigateTo('/search/?q=hi%20there!')
    await driver.waitForElementExistsByTestId('authentication-page')
  }, 30e3)

  // Tests for if auth is not required to search.
  //   it('should load the search page', async () => {
  //     driver = getDriver(
  //       'Search basic integration tests: should load the search page'
  //     )
  //     await driver.navigateTo(
  //       getAbsoluteUrl('/search/?q=hi%20there!')
  //     )
  //     await driver.waitForElementExistsByTestId('search-page')
  //   }, 30e3)
  //
  //   it('should show the query in the search box', async () => {
  //     driver = getDriver(
  //       'Search basic integration tests: should show the query in the search box'
  //     )
  //     await driver.navigateTo(
  //       getAbsoluteUrl('/search/?q=hi%20there!')
  //     )
  //     const inputElemCSSSelector = `[data-test-id='search-input'] > input`
  //
  //     // Wait for the search input element to render.
  //     await driver.waitForElementExistsByCustomSelector(
  //       By.css(inputElemCSSSelector)
  //     )
  //
  //     // Get the value of the search input.
  //     const inputElem = await driver.findElement(
  //       By.css(`[data-test-id='search-input'] > input`)
  //     )
  //     const inputVal = await inputElem.getAttribute('value')
  //     expect(inputVal).toEqual('hi there!')
  //   }, 30e3)
})
