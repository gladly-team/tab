import webdriver from 'selenium-webdriver'

const BROWSER_NAME = 'chrome'

function getDriver () {
  var driver
  if (!process.env.SELENIUM_DRIVER_TYPE || process.env.SELENIUM_DRIVER_TYPE !== 'remote') {
    driver = new webdriver.Builder().forBrowser(BROWSER_NAME).build()
  } else {
    // Input capabilities
    var capabilities = {
      'browserName': BROWSER_NAME,
      'browserstack.user': process.env.BROWSERSTACK_USER,
      'browserstack.key': process.env.BROWSERSTACK_KEY
    }

    driver = new webdriver.Builder()
      .usingServer('http://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .build()
  }
  return driver
}

function getAppBaseUrl () {
  var appBaseUrl = 'http://localhost:3000/'

  if (process.env.PUBLIC_PATH) {
    appBaseUrl = process.env.PUBLIC_PATH
  }

  return appBaseUrl
}

export {
  getDriver,
  getAppBaseUrl
}
