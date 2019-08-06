/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import SetUsernameMutation, {
  __runOnCompleted,
} from 'js/mutations/SetUsernameMutation'
import UsernameField from 'js/components/General/UsernameField'
import { checkIfEmailVerified } from 'js/authentication/helpers'
import TextField from '@material-ui/core/TextField'

jest.mock('js/mutations/SetUsernameMutation')
jest.mock('js/authentication/helpers')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')

const getMockProps = () => ({
  app: 'tab',
  user: {
    id: 'abc-123',
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('EnterUsernameForm tests', () => {
  it('renders without error', () => {
    const EnterUsernameForm = require('js/components/Authentication/EnterUsernameForm')
      .default
    const mockProps = getMockProps()
    shallow(<EnterUsernameForm {...mockProps} />)
  })

  it('calls checkIfEmailVerified on mount', () => {
    const EnterUsernameForm = require('js/components/Authentication/EnterUsernameForm')
      .default
    const mockProps = getMockProps()
    shallow(<EnterUsernameForm {...mockProps} />)
    expect(checkIfEmailVerified).toHaveBeenCalled()
  })

  it('calls SetUsernameMutation when entering a username', () => {
    const EnterUsernameForm = require('js/components/Authentication/EnterUsernameForm')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<EnterUsernameForm {...mockProps} />)
    const usernameTextField = wrapper.find(
      '[data-test-id="enter-username-form-username-field"] input'
    )

    // Enter a username
    // https://github.com/airbnb/enzyme/issues/76#issuecomment-259734821
    usernameTextField.instance().value = 'bobert'

    const button = wrapper
      .find('[data-test-id="enter-username-form-button"]')
      .first()
    button.simulate('click')
    expect(SetUsernameMutation).toHaveBeenCalled()
  })

  it('it does not call SetUsernameMutation when the username is too short and instead shows an error message', () => {
    const EnterUsernameForm = require('js/components/Authentication/EnterUsernameForm')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<EnterUsernameForm {...mockProps} />)
    const usernameTextField = wrapper.find(
      '[data-test-id="enter-username-form-username-field"] input'
    )

    // Enter a too-short username
    usernameTextField.instance().value = 'x'
    const button = wrapper
      .find('[data-test-id="enter-username-form-button"]')
      .first()
    button.simulate('click')

    // We shouldn't call to save the username
    expect(SetUsernameMutation).not.toHaveBeenCalled()

    const textFieldComp = wrapper
      .find('[data-test-id="enter-username-form-username-field"]')
      .find(TextField)
    expect(textFieldComp.prop('helperText')).toEqual(
      'Must be at least two characters.'
    )
    expect(textFieldComp.prop('error')).toBe(true)
  })

  it('it shows an error message when the username is a duplicate', () => {
    const EnterUsernameForm = require('js/components/Authentication/EnterUsernameForm')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<EnterUsernameForm {...mockProps} />)

    // Enter a username
    const usernameTextField = wrapper.find(
      '[data-test-id="enter-username-form-username-field"] input'
    )
    usernameTextField.instance().value = 'Sunol'
    const button = wrapper
      .find('[data-test-id="enter-username-form-button"]')
      .first()
    button.simulate('click')

    // Mock a response with a duplicate username error
    __runOnCompleted({
      setUsername: {
        user: null,
        errors: [
          {
            code: 'USERNAME_DUPLICATE',
            message: 'Username already exists',
          },
        ],
      },
    })
    wrapper.update()

    const textFieldComp = wrapper
      .find('[data-test-id="enter-username-form-username-field"]')
      .find(TextField)
    expect(textFieldComp.prop('helperText')).toEqual(
      'Username is already taken. Please choose another.'
    )
    expect(textFieldComp.prop('error')).toBe(true)
  })

  it('has an input field label of "Username for Tab for a Cause" when the "app" prop === "tab"', () => {
    const mockProps = getMockProps()
    mockProps.app = 'tab'
    const EnterUsernameForm = require('js/components/Authentication/EnterUsernameForm')
      .default
    const wrapper = shallow(<EnterUsernameForm {...mockProps} />)
    expect(wrapper.find(UsernameField).prop('label')).toEqual(
      'Username for Tab for a Cause'
    )
  })

  it('has an input field label of "Username for Search for a Cause" when the "app" prop === "tab"', () => {
    const mockProps = getMockProps()
    mockProps.app = 'search'
    const EnterUsernameForm = require('js/components/Authentication/EnterUsernameForm')
      .default
    const wrapper = shallow(<EnterUsernameForm {...mockProps} />)
    expect(wrapper.find(UsernameField).prop('label')).toEqual(
      'Username for Search for a Cause'
    )
  })
})
