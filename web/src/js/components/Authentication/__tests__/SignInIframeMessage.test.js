/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'

describe('SignInIframeMessage tests', function () {
  it('renders without error', function () {
    const SignInIframeMessage = require('../SignInIframeMessage').default
    shallow(
      <SignInIframeMessage />
    )
  })

  it('redirects the page when clicking the sign-in button', function () {
    const SignInIframeMessage = require('../SignInIframeMessage').default

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

  it('matches expected snapshot', function () {
    const SignInIframeMessage = require('../SignInIframeMessage').default
    const wrapper = shallow(
      <SignInIframeMessage />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
