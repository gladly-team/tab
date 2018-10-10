/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import Typography from '@material-ui/core/Typography'
import {
  getUrlParameters
} from 'js/utils/utils'

jest.mock('js/utils/utils')

describe('SignInIframeMessage tests', () => {
  it('renders without error', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage').default
    shallow(
      <SignInIframeMessage />
    )
  })

  it('redirects the page when clicking the sign-in button', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage').default

    // Mock window.open
    window.open = jest.fn()

    const wrapper = shallow(
      <SignInIframeMessage />
    )
    const signInButton = wrapper.find('[data-test-id="sign-in-iframe-message-button"]')

    expect(window.open).not.toHaveBeenCalled()
    signInButton.simulate('click')
    expect(window.open).toHaveBeenCalled()
  })

  it('has the expected copy', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage').default
    const wrapper = shallow(
      <SignInIframeMessage />
    )
    expect(
      wrapper.find(Typography)
        .first().children().text())
      .toBe(`Let's get started!`)
    expect(
      wrapper.find(Typography)
        .at(1).children().text())
      .toBe(
        `Sign in to customize your new tab page and raise money for your favorite causes.`)
  })

  it('shows the explanation copy when an anonymous user is now required to sign in', () => {
    getUrlParameters.mockReturnValueOnce({
      mandatory: 'true'
    })
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage').default
    const wrapper = shallow(
      <SignInIframeMessage />
    )
    expect(
      wrapper.find(Typography)
        .first().children().text())
      .toBe(`Great job so far!`)
    expect(
      wrapper.find(Typography)
        .at(1).children().text())
      .toMatch(
        `You've already made a positive impact! Let's keep this progress safe:`)
  })

  it('matches expected snapshot', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage').default
    const wrapper = shallow(
      <SignInIframeMessage />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
