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

var setUsername = (Async((driver, username) => {
  const usernameInputId = 'signup-username-input-id'
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(usernameInputId)))
  Await(driverUtils(driver).setValue(By.id(usernameInputId), username))
}))

var setUserEmail = (Async((driver, email) => {
  const emailInputId = 'signup-email-input-id'
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(emailInputId)))
  Await(driverUtils(driver).setValue(By.id(emailInputId), email))
}))

var setUserPassword = (Async((driver, password) => {
  const passwordInputId = 'signup-password-input-id'
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(passwordInputId)))
  Await(driverUtils(driver).setValue(By.id(passwordInputId), password))
}))

var createUser = (Async((driver, username, email, password) => {
  const goToSignUpBtnId = 'toggle-auth-views-btn-id'
  const signUpId = 'register-form-container-test-id'
  const registerActionBtnId = 'register-action-btn-id'
  const dashboardId = 'app-dashboard-id'

  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(goToSignUpBtnId)))
  Await(driverUtils(driver).click(By.id(goToSignUpBtnId)))
  Await(driverUtils(driver).waitForElementVisible(signUpId))

  Await(setUsername(driver, username))
  Await(setUserEmail(driver, email))
  Await(setUserPassword(driver, password))

  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(registerActionBtnId)))
  Await(driverUtils(driver).click(By.id(registerActionBtnId)))

  Await(driverUtils(driver).waitForElementVisible(dashboardId))
}))

var setUsernameForLogin = (Async((driver, username) => {
  const loginUsernameInput = 'login-username-input-id'
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(loginUsernameInput)))
  Await(driverUtils(driver).setValue(By.id(loginUsernameInput), username))
}))

var setUserPasswordForLogin = (Async((driver, password) => {
  const loginPasswordInput = 'login-password-input-id'
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(loginPasswordInput)))
  Await(driverUtils(driver).setValue(By.id(loginPasswordInput), password))
}))

var login = (Async((driver, username, password) => {
  const loginFormId = 'login-form-container-test-id'
  const dashboardId = 'app-dashboard-id'

  Await(driverUtils(driver).waitForElementVisible(loginFormId))

  Await(setUsernameForLogin(driver, username))
  Await(setUserPasswordForLogin(driver, password))
  Await(clickLoginButton(driver))
  Await(driverUtils(driver).waitForElementVisible(dashboardId))
}))

var clickLoginButton = (Async((driver) => {
  const loginActionBtnId = 'login-action-btn-id'
  Await(driverUtils(driver).waitForElementVisibleByCustomSelector(By.id(loginActionBtnId)))
  Await(driverUtils(driver).click(By.id(loginActionBtnId)))
}))

var signOutUser = (Async((driver) => {
  const appMenuTestId = 'app-menu-icon'
  const signOutButtonTestId = 'app-menu-sign-out'
  const loginFormContainerId = 'login-form-container-test-id'

  const dashboardUrl = getAppBaseUrl() + '/tab/'
  Await(driverUtils(driver).navigateTo(dashboardUrl))
  Await(driverUtils(driver).waitForElementVisible(appMenuTestId))
  Await(driverUtils(driver).click(By.css(`[data-test-id='${appMenuTestId}']`)))
  Await(driverUtils(driver).waitForElementVisible(signOutButtonTestId))
  Await(driverUtils(driver).click(By.css(`[data-test-id='${signOutButtonTestId}']`)))
  Await(driverUtils(driver).waitForElementVisible(loginFormContainerId))
}))

export {
  randomString,
  setUserEmail,
  setUserPassword,
  createUser,
  signOutUser,
  login,
  setUsernameForLogin,
  setUserPasswordForLogin,
  clickLoginButton
}
