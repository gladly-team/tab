/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'

jest.mock('js/utils/utils')

const getMockProps = () => ({
  location: {
    search: '',
  },
})

describe('SignInIframeMessage tests', () => {
  it('renders without error', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage')
      .default
    const mockProps = getMockProps()
    shallow(<SignInIframeMessage {...mockProps} />)
  })

  it('redirects the page when clicking the sign-in button', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage')
      .default

    // Mock window.open
    window.open = jest.fn()
    const mockProps = getMockProps()
    const wrapper = shallow(<SignInIframeMessage {...mockProps} />)
    const signInButton = wrapper.find(
      '[data-test-id="sign-in-iframe-message-button"]'
    )

    expect(window.open).not.toHaveBeenCalled()
    signInButton.simulate('click')
    expect(window.open).toHaveBeenCalled()
  })

  it('has the expected copy', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SignInIframeMessage {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .first()
        .children()
        .text()
    ).toBe(`Let's get started!`)
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .children()
        .text()
    ).toBe(
      `Sign in to customize your new tab page and raise money for your favorite causes.`
    )
  })

  it('shows the explanation copy when an anonymous user is now required to sign in', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?mandatory=true'
    const wrapper = shallow(<SignInIframeMessage {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .first()
        .children()
        .text()
    ).toBe(`Great job so far!`)
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .children()
        .text()
    ).toMatch(
      `You've already made a positive impact! Let's keep this progress safe:`
    )
  })
})
