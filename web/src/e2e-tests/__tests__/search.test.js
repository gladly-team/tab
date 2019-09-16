/* eslint-env jest */
/* globals jasmine */

import { getDriver } from '../utils/driver-mgr'

const webdriver = require('selenium-webdriver')
const By = webdriver.By

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

  it('should load the search page (with search query) after signing in', async () => {
    driver = getDriver(
      'Search basic integration tests: should load the search page (with search query) after signing in'
    )
    await driver.navigateTo('/search/?q=hi%20there!') // this should redirect to the auth page
    await driver.waitForElementExistsByTestId('authentication-page')
    await driver.signIn()

    // Make sure we navigate to the search results page after signing in.
    await driver.waitForElementExistsByTestId('search-page')

    // Make sure we show the original search query in the search input.
    const inputElemCSSSelector = `[data-test-id='search-input'] > input`
    await driver.waitForElementExistsByCustomSelector(
      By.css(inputElemCSSSelector)
    )
    const inputElem = await driver.findElement(
      By.css(`[data-test-id='search-input'] > input`)
    )
    const inputVal = await inputElem.getAttribute('value')
    expect(inputVal).toEqual('hi there!')
  }, 30e3)
})
