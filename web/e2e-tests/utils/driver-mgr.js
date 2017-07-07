import webdriver from 'selenium-webdriver'

const BROWSER_NAME = 'chrome'
const BROWSERSTACK_PROJECT = 'tab-tests'
const BROWSERSTACK_BUILD = 'tab-'

function getDriver (testName) {
  var driver
  if (!process.env.SELENIUM_DRIVER_TYPE || process.env.SELENIUM_DRIVER_TYPE !== 'remote') {
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
  var appBaseUrl = 'http://dev-tab2017.gladly.io/'

  if (process.env.PUBLIC_PATH) {
    appBaseUrl = process.env.PUBLIC_PATH
  }

  return appBaseUrl
}

export {
  getDriver,
  getAppBaseUrl
}
