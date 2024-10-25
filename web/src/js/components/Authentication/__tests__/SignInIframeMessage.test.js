/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'

jest.mock('js/navigation/navigation')
jest.mock('js/utils/utils')
jest.mock('js/components/General/Link')

const getMockProps = () => ({
  app: undefined,
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

  it('has the expected Tab for a Cause copy by default', () => {
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

  it('has Search for a Cause copy when the "app" prop === "search"', () => {
    const SignInIframeMessage = require('js/components/Authentication/SignInIframeMessage')
      .default
    const mockProps = getMockProps()
    mockProps.app = 'search'
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
      `Sign in to track your progress as you raise money for your favorite causes.`
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
