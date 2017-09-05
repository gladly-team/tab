/* eslint-env jest */
/* global jasmine */
import Async from 'asyncawait/async'
import Await from 'asyncawait/await'
import driverUtils from '../utils/driver-utils'
import { getDriver, getAppBaseUrl } from '../utils/driver-mgr'
import {
  randomString,
  createUser,
  signOutUser
} from '../utils/test-utils'

let driver
afterEach(() => {
  return driver.quit()
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 180e3

describe('Sign Up Tests', function () {
  it('should create a new user and sign out the user', Async(() => {
    driver = getDriver('Sign Up: should create a new user and sign out the user')
    Await(driverUtils(driver).navigateTo(getAppBaseUrl()))
    const username = randomString(6)
    const email = username + '@tfac.com'
    Await(createUser(driver, username, email, 'NewUserPassword1'))
    Await(signOutUser(driver))
  }), 90e3)
})
