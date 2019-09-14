import webdriver from 'selenium-webdriver'
const By = webdriver.By
const until = webdriver.until

const BROWSER_NAME = 'chrome'
const BROWSERSTACK_PROJECT = 'tab'
const BROWSERSTACK_BUILD = 'tab-'

export const getDriver = testName => {
  var driver
  if (
    !process.env.SELENIUM_DRIVER_TYPE ||
    process.env.SELENIUM_DRIVER_TYPE !== 'remote'
  ) {
    driver = new webdriver.Builder().forBrowser(BROWSER_NAME).build()
  } else {
    var capabilities = {
      browserName: BROWSER_NAME,
      'browserstack.user': process.env.BROWSERSTACK_USER,
      'browserstack.key': process.env.BROWSERSTACK_KEY,
      project: BROWSERSTACK_PROJECT,
      build: BROWSERSTACK_BUILD + process.env.TRAVIS_BUILD_NUMBER,
      name: testName,
    }

    driver = new webdriver.Builder()
      .usingServer('http://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .build()
  }
  return augmentDriver(driver)
}

const getAppBaseUrl = () => {
  const seleniumHostDefault = 'http://localhost:3000'
  var seleniumHost
  if (process.env.SELENIUM_HOST) {
    seleniumHost = process.env.SELENIUM_HOST
  } else {
    console.warn(
      `Environment variable "SELENIUM_HOST" is not set. Using default of "${seleniumHostDefault}".`
    )
    seleniumHost = seleniumHostDefault
  }

  return seleniumHost
}

const getAbsoluteUrl = relativeUrl => {
  return `${getAppBaseUrl()}${relativeUrl}`
}

// Add some helper methods to the Selenium driver.
const augmentDriver = driver => {
  driver.waitForElementExistsByCustomSelector = selector =>
    driver.wait(until.elementLocated(selector))

  driver.waitForElementExistsByTestId = dataTestId =>
    driver.wait(until.elementLocated(By.css(`[data-test-id='${dataTestId}']`)))

  driver.getElementByTestId = dataTestId =>
    driver.findElement(By.css(`[data-test-id='${dataTestId}']`))

  driver.getElementByCSSSelector = selector =>
    driver.findElement(By.css(selector))

  driver.setValue = (selector, value) =>
    driver.findElement(selector).sendKeys(value)

  driver.click = selector => driver.findElement(selector).click()

  driver.navigateTo = url => driver.navigate().to(getAbsoluteUrl(url))

  return driver
}
