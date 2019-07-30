/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'

jest.mock('js/navigation/navigation')
jest.mock('js/utils/utils')
jest.mock('js/components/General/Link')

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

  it('wraps the sign-in button in a link that opens the expected auth page in the top of the frame', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SignInIframeMessage {...mockProps} />)
    const signInButton = wrapper.find(
      '[data-test-id="sign-in-iframe-message-button"]'
    )
    const linkElem = signInButton.parent()

    expect(linkElem.type()).toEqual(Link)
    expect(linkElem.prop('to')).toEqual(
      'https://tab-test-env.gladly.io/newtab/auth/'
    )
    expect(linkElem.prop('target')).toEqual('_top')
  })

  it('the sign-in button link passes forward any existing URL query parameters', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?app=search&some=datums'
    const wrapper = shallow(<SignInIframeMessage {...mockProps} />)
    const signInButton = wrapper.find(
      '[data-test-id="sign-in-iframe-message-button"]'
    )
    const linkElem = signInButton.parent()

    expect(linkElem.type()).toEqual(Link)
    expect(linkElem.prop('to')).toEqual(
      'https://tab-test-env.gladly.io/newtab/auth/?app=search&some=datums'
    )
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
