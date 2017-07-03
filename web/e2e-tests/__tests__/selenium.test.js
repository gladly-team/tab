/* eslint-env jest */
import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
import webdriver from 'selenium-webdriver'
import driverUtils from '../utils/driverUtils'

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
  it('should render the email request view', Async(() => {
    const emailInputId = 'login-email-input-id'
    Await(driverUtils(driver).waitForElementVisibleByCustomSelector(
      By.id(emailInputId)))
  }))

  it('should go to the password request view after setting the email', Async(() => {
    const emailInputId = 'login-email-input-id'
    const confirmEmailBtnId = 'confirm-email-btn-id'
    const passwordConfirmationContainerId = 'password-form-container-test-id'

    Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(emailInputId)))
    Await(driverUtils(driver).setValue(By.id(emailInputId), 'kevin@gladly.io'))
    Await(driverUtils(driver).click(By.id(confirmEmailBtnId)))
    Await(driverUtils(driver).waitForElementVisible(passwordConfirmationContainerId))
  }))
})
