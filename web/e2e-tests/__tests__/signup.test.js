/* eslint-env jest */
import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
import driverUtils from '../utils/driver-utils'
import { getDriver, getAppBaseUrl } from '../utils/driver-mgr'
import {
  randomString,
  setUserEmail,
  setUserPassword,
  createUser,
  signOutUser
} from '../utils/test-utils'

let driver
afterEach(() => {
  return driver.quit()
})

describe('Sign Up Tests', function () {
  it('should create a new user and signout the user', Async(() => {
    driver = getDriver('Sign Up Tests: create new user and sign out')
    Await(driverUtils(driver).navigateTo(getAppBaseUrl()))
    const newUserEmail = randomString(6) + '@tfac.com'
    Await(createUser(driver, newUserEmail, 'NewUserPassword1'))
    Await(signOutUser(driver))
  }), 60000)

  it('should not create a user if email already registered', Async(() => {
    driver = getDriver('Sign Up Tests: do not create user if duplicate email')
    Await(driverUtils(driver).navigateTo(getAppBaseUrl()))

    // Create a new user
    const userEmail = randomString(6) + '@tfac.com'
    const userPassword = 'NewUserPassword1'
    Await(createUser(driver, userEmail, userPassword))
    Await(signOutUser(driver))

    // Try signing in as that user with the wrong password
    Await(driverUtils(driver).navigateTo(getAppBaseUrl()))
    const wrongPassword = userPassword + 'Bad'
    Await(setUserEmail(driver, userEmail))
    Await(setUserPassword(driver, wrongPassword))
    const signUpErrorSnackBarId = 'signup-error-snackbar'
    Await(driverUtils(driver).waitForElementVisible(signUpErrorSnackBarId))
  }), 60000)
})
