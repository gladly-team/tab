const webdriver = require('selenium-webdriver')
const By = webdriver.By
const until = webdriver.until

export default driver => ({
  waitForElementExistsByCustomSelector: selector => {
    return driver.wait(until.elementLocated(selector))
  },

  waitForElementExistsByTestId: dataTestId => {
    return driver.wait(
      until.elementLocated(By.css("[data-test-id='" + dataTestId + "']"))
    )
  },

  getText: selector => {
    return driver.findElement(selector).getText()
  },

  getValue: selector => {
    return driver.findElement(selector).getAttribute('value')
  },

  setValue: (selector, value) => {
    return driver.findElement(selector).sendKeys(value)
  },

  click: selector => {
    return driver.findElement(selector).click()
  },

  navigateTo: url => {
    return driver.navigate().to(url)
  },
})
