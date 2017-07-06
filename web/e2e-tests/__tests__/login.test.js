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

beforeAll(() => {
  driver = getDriver()
})

afterAll(() => {
  return driver.quit()
})

var testSetup = (Async(() => {
  Await(driverUtils(driver).navigateTo(getAppBaseUrl()))
}))

describe('Login Tests', function () {
  it('should login an existing user', Async(() => {
    Await(testSetup())

    const userEmail = randomString(6) + '@tfac.com'
    const userPassword = 'NewUserPassword1'
    Await(createUser(driver, userEmail, userPassword))
    Await(signOutUser(driver))

    Await(testSetup())

    Await(setUserEmail(driver, userEmail))
    Await(setUserPassword(driver, userPassword))
    const dashboardId = 'app-dashboard-id'
    Await(driverUtils(driver).waitForElementVisible(dashboardId))
    Await(signOutUser(driver))
  }), 30000)
})
