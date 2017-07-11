import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
import webdriver from 'selenium-webdriver'
import driverUtils from './driver-utils'
import { getAppBaseUrl } from './driver-mgr'

var By = webdriver.By

function randomString (length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

var setUserEmail = (Async((driver, email) => {
  const emailInputId = 'login-email-input-id'
  const confirmEmailBtnId = 'confirm-email-btn-id'
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(emailInputId)))
  Await(driverUtils(driver).setValue(By.id(emailInputId), email))
  Await(driverUtils(driver).click(By.id(confirmEmailBtnId)))
}))

var setUserPassword = (Async((driver, password) => {
  const passwordConfirmationContainerId = 'password-form-container-test-id'
  const passwordInputId = 'login-password-input-id'
  const confirmPasswordBtnId = 'confirm-password-btn-id'
  Await(driverUtils(driver).waitForElementVisible(passwordConfirmationContainerId))
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(passwordInputId)))
  Await(driverUtils(driver).setValue(By.id(passwordInputId), password))
  Await(driverUtils(driver).click(By.id(confirmPasswordBtnId)))
}))

var createUser = (Async((driver, email, password) => {
  const dashboardId = 'app-dashboard-id'
  Await(setUserEmail(driver, email))
  Await(setUserPassword(driver, password))
  Await(driverUtils(driver).waitForElementVisible(dashboardId))
}))

var signOutUser = (Async((driver) => {
  const settingsViewId = 'app-settings-id'
  const signOutBtnId = 'app-signout-btn'
  const emailInputId = 'login-email-input-id'

  const settingsUrl = getAppBaseUrl() + '/tab/settings/'

  Await(driverUtils(driver).navigateTo(settingsUrl))
  Await(driverUtils(driver).waitForElementVisible(settingsViewId))
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(signOutBtnId)))
  Await(driverUtils(driver).click(By.id(signOutBtnId)))
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(emailInputId)))
}))

export {
  randomString,
  setUserEmail,
  setUserPassword,
  createUser,
  signOutUser
}
