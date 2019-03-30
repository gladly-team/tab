const webdriver = require('selenium-webdriver')
const By = webdriver.By
const until = webdriver.until

// TODO: we should just extend the driver for ease of use.
export default driver => ({
  waitForElementExistsByCustomSelector: selector => {
    return driver.wait(until.elementLocated(selector))
  },

  waitForElementExistsByTestId: dataTestId => {
    return driver.wait(
      until.elementLocated(By.css(`[data-test-id='${dataTestId}']`))
    )
  },

  getElementByTestId: dataTestId => {
    return driver.findElement(By.css(`[data-test-id='${dataTestId}']`))
  },

  getElementByCSSSelector: selector => {
    return driver.findElement(By.css(selector))
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
