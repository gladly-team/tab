 /* eslint-env jest */
 /* global jasmine */
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

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

describe('Login Tests', function () {
  it('should login an existing user', Async(() => {
    driver = getDriver('Login: should login an existing user')
    Await(driverUtils(driver).navigateTo(getAppBaseUrl()))

    // Create a new user
    const userEmail = randomString(6) + '@tfac.com'
    const userPassword = 'NewUserPassword1'
    Await(createUser(driver, userEmail, userPassword))
    Await(signOutUser(driver))

    // Log in as that user
    Await(driverUtils(driver).navigateTo(getAppBaseUrl()))
    Await(setUserEmail(driver, userEmail))
    Await(setUserPassword(driver, userPassword))
    const dashboardId = 'app-dashboard-id'
    Await(driverUtils(driver).waitForElementVisible(dashboardId))
    Await(signOutUser(driver))
  }), 60000)
})
