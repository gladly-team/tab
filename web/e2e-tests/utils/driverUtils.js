const webdriver = require('selenium-webdriver')
const By = webdriver.By
const until = webdriver.until

module.exports = driver => ({
  waitForElementVisibleByCustomSelector: function (selector) {
    return driver.wait(until.elementLocated(selector))
  },
  waitForElementVisible: function (dataTestId) {
    return driver.wait(
        until.elementLocated(
            By.css("[data-test-id='" + dataTestId + "']")
            )
        )
  },
  getText: function (selector) {
    return driver.findElement(selector).getText()
  },
  getValue: function (selector) {
    return driver.findElement(selector).getAttribute('value')
  },
  setValue: function (selector, value) {
    return driver.findElement(selector).sendKeys(value)
  },
  click: function (selector) {
    return driver.findElement(selector).click()
  }
})
