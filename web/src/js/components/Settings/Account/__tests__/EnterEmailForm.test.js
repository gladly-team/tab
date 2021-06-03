/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import { updateUserEmail } from 'js/authentication/user'
import TextField from '@material-ui/core/TextField'
import { flushAllPromises } from 'js/utils/test-utils'
import {
  loginURL,
  replaceUrl,
  constructUrl,
  accountURL,
} from 'js/navigation/navigation'
import { PaperItem } from 'js/components/Settings/Account/EnterEmailForm'

jest.mock('js/authentication/helpers')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/authentication/user')

const getMockProps = () => ({
  onCompleted: () => {},
  user: {
    id: 'abc-123',
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('EnterEmailForm tests', () => {
  it('renders without error', () => {
    const EnterEmailForm = require('js/components/Settings/Account/EnterEmailForm')
      .default
    const mockProps = getMockProps()
    shallow(<EnterEmailForm {...mockProps} />)
  })

  it('calls updateUserEmail when clicking the submission button with an email in the input', () => {
    const EnterEmailForm = require('js/components/Settings/Account/EnterEmailForm')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<EnterEmailForm {...mockProps} />)
    const emailTextField = wrapper.find(
      '[data-test-id="enter-email-form-email-field"] input'
    )

    updateUserEmail.mockResolvedValue()
    emailTextField.instance().value = 'test'

    const button = wrapper
      .find('[data-test-id="enter-email-form-button"]')
      .first()
    button.simulate('click')

    expect(updateUserEmail).toHaveBeenCalledWith('test')
  })

  it('calls updateUserEmail when hitting the "enter" key button with a email in the input', () => {
    const EnterEmailForm = require('js/components/Settings/Account/EnterEmailForm')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<EnterEmailForm {...mockProps} />)
    const emailTextField = wrapper.find(
      '[data-test-id="enter-email-form-email-field"] input'
    )

    emailTextField.instance().value = 'test'
    emailTextField.simulate('keypress', { key: 'Enter' })

    expect(updateUserEmail).toHaveBeenCalledWith('test')
  })

  it('shows an error message when the email is a duplicate', async () => {
    expect.assertions(2)
    const EnterEmailForm = require('js/components/Settings/Account/EnterEmailForm')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<EnterEmailForm {...mockProps} />)

    const emailTextField = wrapper.find(
      '[data-test-id="enter-email-form-email-field"] input'
    )
    emailTextField.instance().value = 'Sunol'

    updateUserEmail.mockRejectedValue({ code: 'auth/email-already-in-use' })

    const button = wrapper
      .find('[data-test-id="enter-email-form-button"]')
      .first()
    button.simulate('click')

    await flushAllPromises()
    wrapper.update()

    const textFieldComp = wrapper
      .find('[data-test-id="enter-email-form-email-field"]')
      .find(TextField)
    expect(textFieldComp.prop('helperText')).toEqual(
      'Email is already taken. Please choose another.'
    )
    expect(textFieldComp.prop('error')).toBe(true)
  })

  it('shows an error message when the email is invalid', async () => {
    expect.assertions(2)
    const EnterEmailForm = require('js/components/Settings/Account/EnterEmailForm')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<EnterEmailForm {...mockProps} />)

    const emailTextField = wrapper.find(
      '[data-test-id="enter-email-form-email-field"] input'
    )
    emailTextField.instance().value = 'Sunol'

    updateUserEmail.mockRejectedValue({
      code: 'auth/internal-error',
      message: JSON.stringify({
        error: { message: 'INVALID_NEW_EMAIL' },
      }),
    })

    const button = wrapper
      .find('[data-test-id="enter-email-form-button"]')
      .first()
    button.simulate('click')

    await flushAllPromises()
    wrapper.update()

    const textFieldComp = wrapper
      .find('[data-test-id="enter-email-form-email-field"]')
      .find(TextField)
    expect(textFieldComp.prop('helperText')).toEqual('Email is invalid.')
    expect(textFieldComp.prop('error')).toBe(true)
  })

  it('redirects the user if they have not authed recently enough', async () => {
    const EnterEmailForm = require('js/components/Settings/Account/EnterEmailForm')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<EnterEmailForm {...mockProps} />)

    const emailTextField = wrapper.find(
      '[data-test-id="enter-email-form-email-field"] input'
    )
    emailTextField.instance().value = 'Sunol'

    updateUserEmail.mockRejectedValue({ code: 'auth/requires-recent-login' })

    const button = wrapper
      .find('[data-test-id="enter-email-form-button"]')
      .first()
    button.simulate('click')

    await flushAllPromises()
    wrapper.update()

    expect(replaceUrl).toHaveBeenCalledWith(loginURL, {
      next: constructUrl(accountURL, { reauthed: true }),
      reauth: 'true',
    })
  })
})
