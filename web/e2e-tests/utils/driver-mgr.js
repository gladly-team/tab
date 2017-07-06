import webdriver from 'selenium-webdriver'

function getDriver () {
  var driver
  if (!process.env.SELENIUM_DRIVER_TYPE || process.env.SELENIUM_DRIVER_TYPE !== 'remote') {
    driver = new webdriver.Builder().forBrowser('chrome').build()
  } else {
    // Add here the contruction for the driver in development testing.
    return null
  }
  return driver
}

function getAppBaseUrl () {
  var appBaseUrl = 'http://localhost:3000/'
  if (process.env.WEB_HOST && process.env.WEB_PORT) {
    appBaseUrl = 'http://' + process.env.WEB_HOST + ':' + process.env.WEB_PORT + '/'
  }
  return appBaseUrl
}

export {
  getDriver,
  getAppBaseUrl
}
