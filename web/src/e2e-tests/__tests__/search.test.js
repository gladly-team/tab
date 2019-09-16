/* eslint-env jest */
/* globals jasmine */

import { getDriver, getAbsoluteUrl } from '../utils/driver-mgr'
const fetch = require('node-fetch')
const webdriver = require('selenium-webdriver')
const By = webdriver.By

let driver
afterEach(() => {
  if (driver && driver.quit) {
    return driver.quit()
  }
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 35e3

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

  // This can help catch errors in our build-time prerendering.
  it('contains the expected prerendered HTML for the search results page', async () => {
    const url = getAbsoluteUrl('/search?q=tacos')
    var html
    try {
      const response = await fetch(url)
      html = await response.text()
    } catch (e) {
      throw e
    }

    // Do a rough check that the prerendered HTML contains the expected
    // components for the search results page and not the auth page.
    expect(html.indexOf('data-test-id="search-page"')).toBeGreaterThan(-1)
    expect(html.indexOf('data-test-id="authentication-page"')).toEqual(-1)
    expect(html.indexOf('data-test-id="search-input"')).toBeGreaterThan(-1)
    expect(html.indexOf('data-test-id="search-results"')).toBeGreaterThan(-1)
  }, 30e3)
})
