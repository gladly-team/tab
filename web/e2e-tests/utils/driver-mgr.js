import webdriver from 'selenium-webdriver'

const BROWSER_NAME = 'chrome'
const BROWSERSTACK_PROJECT = 'tab'
const BROWSERSTACK_BUILD = 'tab-'

function getDriver (testName) {
  var driver
  if (process.env.SELENIUM_DRIVER_TYPE === 'remote') {
    driver = new webdriver.Builder().forBrowser(BROWSER_NAME).build()
  } else {
    var capabilities = {
      'browserName': BROWSER_NAME,
      'browserstack.user': process.env.BROWSERSTACK_USER,
      'browserstack.key': process.env.BROWSERSTACK_KEY,
      'project': BROWSERSTACK_PROJECT,
      'build': BROWSERSTACK_BUILD + process.env.TRAVIS_BUILD_NUMBER,
      'name': testName
    }

    driver = new webdriver.Builder()
      .usingServer('http://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .build()
  }
  return driver
}

function getAppBaseUrl () {
  const seleniumHostDefault = 'http://localhost:3000'
  var seleniumHost
  if (process.env.SELENIUM_HOST) {
    seleniumHost = process.env.SELENIUM_HOST
  } else {
    console.warn(`Environment variable "SELENIUM_HOST" is not set. Using default of "${seleniumHostDefault}".`)
    seleniumHost = seleniumHostDefault
  }

  return seleniumHost
}

export {
  getDriver,
  getAppBaseUrl
}
