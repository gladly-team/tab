 /* eslint-env jest */
 /* global jasmine */
import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
import driverUtils from '../utils/driver-utils'
import { getDriver, getAppBaseUrl } from '../utils/driver-mgr'
import {
  randomString,
  createUser,
  signOutUser,
  login
} from '../utils/test-utils'

let driver
afterEach(() => {
  return driver.quit()
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 180e3

describe('Login Tests', function () {
  it('should login an existing user', Async(() => {
    driver = getDriver('Login: should login an existing user')
    Await(driverUtils(driver).navigateTo(getAppBaseUrl()))

    // Create a new user
    const username = randomString(6)
    const userEmail = username + '@tfac.com'
    const userPassword = 'NewUserPassword1'
    Await(createUser(driver, username, userEmail, userPassword))
    Await(signOutUser(driver))

    // Log in as that user with username
    Await(driverUtils(driver).navigateTo(getAppBaseUrl()))
    Await(login(driver, username, userPassword))

    const dashboardId = 'app-dashboard-id'
    Await(driverUtils(driver).waitForElementVisible(dashboardId))
    Await(signOutUser(driver))

    // Log in as that user with email
    Await(driverUtils(driver).navigateTo(getAppBaseUrl()))
    Await(login(driver, userEmail, userPassword))

    Await(driverUtils(driver).waitForElementVisible(dashboardId))
    Await(signOutUser(driver))
  }), 90e3)
})
