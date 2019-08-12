/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { logout, sendVerificationEmail } from 'js/authentication/user'
import { goTo, loginURL } from 'js/navigation/navigation'

jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')

const getMockProps = () => ({
  app: 'tab',
})

describe('VerifyEmailMessage tests', function() {
  it('renders without error', function() {
    const VerifyEmailMessage = require('js/components/Authentication/VerifyEmailMessage')
      .default
    const mockProps = getMockProps()
    shallow(<VerifyEmailMessage {...mockProps} />)
  })

  it('restarts the auth flow when clicking cancel button', done => {
    const VerifyEmailMessage = require('js/components/Authentication/VerifyEmailMessage')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<VerifyEmailMessage {...mockProps} />)
    const button = wrapper
      .find('[data-test-id="verify-email-message-cancel-button"]')
      .first()
    button.simulate('click')

    // Dealing with async methods triggered by `simulate`:
    // https://stackoverflow.com/a/43855794/1332513
    setImmediate(() => {
      expect(logout).toHaveBeenCalled()
      expect(goTo).toHaveBeenCalledWith(loginURL, null, { keepURLParams: true })
      done()
    })
  })

  it('the "resend email" button calls to send a new verification email', done => {
    const VerifyEmailMessage = require('js/components/Authentication/VerifyEmailMessage')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<VerifyEmailMessage {...mockProps} />)
    const button = wrapper
      .find('[data-test-id="verify-email-message-resend-button"]')
      .last()
    button.simulate('click')

    setImmediate(() => {
      expect(sendVerificationEmail).toHaveBeenCalled()
      done()
    })
  })

  it('the verification email has a "continueURL" with the URL param "app" === "tab" when the "app" prop is not provided', done => {
    const VerifyEmailMessage = require('js/components/Authentication/VerifyEmailMessage')
      .default
    const mockProps = getMockProps()
    mockProps.app = undefined
    const wrapper = mount(<VerifyEmailMessage {...mockProps} />)
    const button = wrapper
      .find('[data-test-id="verify-email-message-resend-button"]')
      .last()
    button.simulate('click')

    setImmediate(() => {
      expect(sendVerificationEmail).toHaveBeenCalledWith({
        continueURL:
          'https://tab-test-env.gladly.io/newtab/auth/username/?app=tab',
      })
      done()
    })
  })

  it('the verification email has a "continueURL" with the URL param "app" === "tab" when the "app" prop is some total nonsense', done => {
    // Suppress an expected error from invalid PropTypes.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const VerifyEmailMessage = require('js/components/Authentication/VerifyEmailMessage')
      .default
    const mockProps = getMockProps()
    mockProps.app = 'ablavefaeifoewcvoie4'
    const wrapper = mount(<VerifyEmailMessage {...mockProps} />)
    const button = wrapper
      .find('[data-test-id="verify-email-message-resend-button"]')
      .last()
    button.simulate('click')

    setImmediate(() => {
      expect(sendVerificationEmail).toHaveBeenCalledWith({
        continueURL:
          'https://tab-test-env.gladly.io/newtab/auth/username/?app=tab',
      })
      done()
    })
  })

  it('the verification email has a "continueURL" with the URL param "app" === "tab" when the "app" prop is "tab"', done => {
    const VerifyEmailMessage = require('js/components/Authentication/VerifyEmailMessage')
      .default
    const mockProps = getMockProps()
    mockProps.app = 'tab'
    const wrapper = mount(<VerifyEmailMessage {...mockProps} />)
    const button = wrapper
      .find('[data-test-id="verify-email-message-resend-button"]')
      .last()
    button.simulate('click')

    setImmediate(() => {
      expect(sendVerificationEmail).toHaveBeenCalledWith({
        continueURL:
          'https://tab-test-env.gladly.io/newtab/auth/username/?app=tab',
      })
      done()
    })
  })

  it('the verification email has a "continueURL" with the URL param "app" === "search" when the "app" prop is "search"', done => {
    const VerifyEmailMessage = require('js/components/Authentication/VerifyEmailMessage')
      .default
    const mockProps = getMockProps()
    mockProps.app = 'search'
    const wrapper = mount(<VerifyEmailMessage {...mockProps} />)
    const button = wrapper
      .find('[data-test-id="verify-email-message-resend-button"]')
      .last()
    button.simulate('click')

    setImmediate(() => {
      expect(sendVerificationEmail).toHaveBeenCalledWith({
        continueURL:
          'https://tab-test-env.gladly.io/newtab/auth/username/?app=search',
      })
      done()
    })
  })

  it('matches expected snapshot', function() {
    const VerifyEmailMessage = require('js/components/Authentication/VerifyEmailMessage')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<VerifyEmailMessage {...mockProps} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
