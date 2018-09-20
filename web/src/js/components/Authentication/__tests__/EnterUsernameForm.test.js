/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SetUsernameMutation, {
  __runOnCompleted
} from 'mutations/SetUsernameMutation'
import {
  checkIfEmailVerified
} from 'authentication/helpers'

jest.mock('mutations/SetUsernameMutation')
jest.mock('authentication/helpers')

const mockUserData = {
  id: 'abc-123'
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('EnterUsernameForm tests', function () {
  it('renders without error', function () {
    const EnterUsernameForm = require('../EnterUsernameForm').default
    shallow(
      <EnterUsernameForm user={mockUserData} />
    )
  })

  it('calls checkIfEmailVerified on mount', async () => {
    expect.assertions(1)

    const EnterUsernameForm = require('../EnterUsernameForm').default
    shallow(
      <EnterUsernameForm {...mockUserData} />
    )
    expect(checkIfEmailVerified).toHaveBeenCalledTimes(1)
  })

  it('calls SetUsernameMutation when entering a username', function () {
    const EnterUsernameForm = require('../EnterUsernameForm').default

    // TODO:
    // After updating to Material UI 1.x, we shouldn't have to wrap our tested
    // components in the MuiThemeProvider.
    // https://github.com/mui-org/material-ui/issues/5330#issuecomment-251843011
    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <EnterUsernameForm user={mockUserData} />
      </MuiThemeProvider>
    )
    const usernameTextField = wrapper.find('[data-test-id="enter-username-form-username-field"] input')

    // Enter a username
    // https://github.com/airbnb/enzyme/issues/76#issuecomment-259734821
    usernameTextField.instance().value = 'bobert'

    // TODO: put a data-test-id directly on the button component
    // after updating to Material UI 1.x. We need to do this in many tests.
    // @material-ui-1-todo: use specific selector
    const button = wrapper.find('[data-test-id="enter-username-form-button-container"] button')
    button.simulate('click')
    expect(SetUsernameMutation).toHaveBeenCalled()
  })

  it('it does not call SetUsernameMutation when the username is too short and instead shows an error message', function () {
    const EnterUsernameForm = require('../EnterUsernameForm').default

    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <EnterUsernameForm user={mockUserData} />
      </MuiThemeProvider>
    )
    // @material-ui-1-todo: use specific selector
    const usernameTextField = wrapper.find('[data-test-id="enter-username-form-username-field"] input')

    // Enter a too-short username
    usernameTextField.instance().value = 'x'
    const button = wrapper.find('[data-test-id="enter-username-form-button-container"] button')
    button.simulate('click')

    // We shouldn't call to save the username
    expect(SetUsernameMutation).not.toHaveBeenCalled()

    // Compare to snapshot, which should have an error message state.
    // Probably better to find and test the actual error message component,
    // but this is okay for now.
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('it shows an error message when the username is a duplicate', function () {
    const EnterUsernameForm = require('../EnterUsernameForm').default

    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <EnterUsernameForm user={mockUserData} />
      </MuiThemeProvider>
    )

    // Enter a username
    const usernameTextField = wrapper.find('[data-test-id="enter-username-form-username-field"] input')
    usernameTextField.instance().value = 'Sunol'
    const button = wrapper.find('[data-test-id="enter-username-form-button-container"] button')
    button.simulate('click')

    // Mock a response with a duplicate username error
    __runOnCompleted({
      setUsername: {
        user: null,
        errors: [{
          code: 'USERNAME_DUPLICATE',
          message: 'Username already exists'
        }]
      }
    })
    wrapper.update()

    // Compare to snapshot, which should have an error message state
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('matches expected snapshot', function () {
    const EnterUsernameForm = require('../EnterUsernameForm').default
    const wrapper = shallow(
      <EnterUsernameForm user={mockUserData} />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
