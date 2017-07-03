/* eslint-env jest */
import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
import webdriver from 'selenium-webdriver'
import driverUtils from '../utils/driverUtils'
import { getDriver, getAppBaseUrl } from '../utils/driverMgr'

var By = webdriver.By
let driver

beforeAll(() => {
  driver = getDriver()
})

afterAll(() => {
  return driver.quit()
})

beforeEach(() => {
  return driverUtils(driver).navigateTo(getAppBaseUrl())
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
    Await(driverUtils(driver).setValue(By.id(emailInputId), 'raul@tfac.com'))
    Await(driverUtils(driver).click(By.id(confirmEmailBtnId)))
    Await(driverUtils(driver).waitForElementVisible(passwordConfirmationContainerId))
  }))
})
