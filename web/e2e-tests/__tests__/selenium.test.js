/* eslint-env jest */
var webdriver = require('selenium-webdriver')
var driverUtils = require('../utils/driverUtils')
var By = webdriver.By

let driver

beforeAll(() => {
  driver = new webdriver.Builder().forBrowser('chrome').build()
})

afterAll(() => {
  return driver.quit()
})

beforeEach(() => {
  return driver.navigate().to('http://localhost:3000/')
})

describe('Authentication tests', function () {
  it('should render the email request view', () => {
    const emailInputId = 'login-email-input-id'
    return driverUtils(driver).waitForElementVisibleByCustomSelector(
      By.id(emailInputId))
  })

  it('should go to the password request view after setting the email', () => {
    const emailInputId = 'login-email-input-id'
    const confirmEmailBtnId = 'confirm-email-btn-id'
    const passwordConfirmationContainerId = 'password-form-container-test-id'

    return driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(emailInputId))
            .then((_) => {
              driverUtils(driver).setValue(By.id(emailInputId), 'kevin@gladly.io').then(() => {
                driverUtils(driver).click(By.id(confirmEmailBtnId)).then(() => {
                  driverUtils(driver).waitForElementVisible(passwordConfirmationContainerId)
                })
              })
            })
  })
})
