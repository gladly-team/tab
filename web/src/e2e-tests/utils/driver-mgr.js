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

export const getAbsoluteUrl = relativeUrl => {
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

  driver.signIn = async () => {
    // We set these private env vars directly in our CI tool.
    const testUserEmail = process.env.INTEGRATION_TEST_USER_EMAIL
    const testUserPassword = process.env.INTEGRATION_TEST_USER_PASSWORD
    if (!testUserEmail) {
      throw new Error(
        'You must provide an email via `process.env.INTEGRATION_TEST_USER_EMAIL`.'
      )
    }
    if (!testUserPassword) {
      throw new Error(
        'You must provide an email via `process.env.INTEGRATION_TEST_USER_PASSWORD`.'
      )
    }

    const emailSignInButtonSelector = By.css('[data-provider-id="password"]')
    const emailInputSelector = By.css('input[name="email"]')
    const passwordInputSelector = By.css('input[name="password"]')

    await driver.waitForElementExistsByCustomSelector(emailSignInButtonSelector)
    await driver.click(emailSignInButtonSelector)
    await driver.waitForElementExistsByCustomSelector(emailInputSelector)
    await driver.setValue(emailInputSelector, testUserEmail)
    await driver.click(By.css('button[type="submit"]'))
    await driver.waitForElementExistsByCustomSelector(passwordInputSelector)
    await driver.setValue(passwordInputSelector, testUserPassword)
    await driver.click(By.css('button[type="submit"]'))
  }

  return driver
}
