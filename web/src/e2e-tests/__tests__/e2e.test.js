/* globals process */
/* eslint-env jest */
import init from 'tab-e2e'

const tests = init({
  selenium: {
    SELENIUM_DRIVER_TYPE: process.env.SELENIUM_DRIVER_TYPE,
    INTEGRATION_TEST_USER_EMAIL: process.env.INTEGRATION_TEST_USER_EMAIL,
    INTEGRATION_TEST_USER_PASSWORD: process.env.INTEGRATION_TEST_USER_PASSWORD,
  },
  browserstack: {
    BROWSERSTACK_USER: process.env.BROWSERSTACK_USER,
    BROWSERSTACK_KEY: process.env.BROWSERSTACK_KEY,
  },
  build: { TRAVIS_BUILD_NUMBER: process.env.TRAVIS_BUILD_NUMBER },
  mailosaur: {
    MAILOSAUR_SERVER_ID: process.env.MAILOSAUR_SERVER_ID,
    MAILOSAUR_API_KEY: process.env.MAILOSAUR_API_KEY,
  },
})

describe('Tab: acceptance tests', () => {
  tests.forEach(({ description, test, testTimeout }) =>
    it(description, test, testTimeout)
  )
})
