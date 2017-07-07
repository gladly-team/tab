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

const testName = 'Sign Up Tests'

let driver

beforeAll(() => {
  driver = getDriver(testName)
})

afterAll(() => {
  return driver.quit()
})

var testSetup = (Async(() => {
  Await(driverUtils(driver).navigateTo(getAppBaseUrl()))
}))

describe(testName, function () {
  it('should create a new user and signout the user', Async(() => {
    Await(testSetup())

    const newUserEmail = randomString(6) + '@tfac.com'
    Await(createUser(driver, newUserEmail, 'NewUserPassword1'))

    Await(signOutUser(driver))
  }), 20000)

  it('should not create a user if email already registered', Async(() => {
    Await(testSetup())

    const userEmail = randomString(6) + '@tfac.com'
    const userPassword = 'NewUserPassword1'

    Await(createUser(driver, userEmail, userPassword))

    Await(signOutUser(driver))

    Await(testSetup())

    const wrongPassword = userPassword + 'Bad'

    Await(setUserEmail(driver, userEmail))
    Await(setUserPassword(driver, wrongPassword))

    const signUpErrorSnackBarId = 'signup-error-snackbar'
    Await(driverUtils(driver).waitForElementVisible(signUpErrorSnackBarId))
  }), 20000)
})
