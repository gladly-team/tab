/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SetUsernameMutation from 'mutations/SetUsernameMutation'

jest.mock('mutations/SetUsernameMutation')

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

  it('calls SetUsernameMutation when entering a username', function () {
    const EnterUsernameForm = require('../EnterUsernameForm').default

    // TODO:
    // After updating to Material UI 1.x, we shouldn't have to wrap our tested
    // components in the MuiThemeProvider.
    // https://github.com/mui-org/material-ui/issues/5330#issuecomment-251843011
    const wrapper = mount(
      <MuiThemeProvider>
        <EnterUsernameForm user={mockUserData} />
      </MuiThemeProvider>
    )
    const usernameTextField = wrapper.find('[data-test-id="enter-username-form-username-field"] input')

    // Enter a username
    // https://github.com/airbnb/enzyme/issues/76#issuecomment-259734821
    usernameTextField.instance().value = 'bobert'
    wrapper.update()

    // TODO: put a data-test-id directly on the button component
    // after updating to Material UI 1.x. We need to do this in many tests.
    const button = wrapper.find('[data-test-id="enter-username-form-button-container"] button')
    button.simulate('click')
    expect(SetUsernameMutation).toHaveBeenCalled()
  })

  it('matches expected snapshot', function () {
    const EnterUsernameForm = require('../EnterUsernameForm').default
    const wrapper = shallow(
      <EnterUsernameForm user={mockUserData} />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
