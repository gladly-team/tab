/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { searchForACauseAccountCreated } from 'js/analytics/logEvent'

jest.mock('js/analytics/logEvent')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  user: {
    searches: 0,
  },
})

describe('LogSearchAccountCreation component', function() {
  it('logs the "search account creation" analytics event when the user\'s makes their first search', function() {
    const LogSearchAccountCreationComponent = require('js/components/Search/LogSearchAccountCreationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.searches = 0
    const wrapper = shallow(
      <LogSearchAccountCreationComponent {...mockProps} />
    )
    expect(searchForACauseAccountCreated).not.toHaveBeenCalled()
    wrapper.setProps({
      ...mockProps,
      user: {
        ...mockProps.user,
        searches: 1,
      },
    })
    expect(searchForACauseAccountCreated).toHaveBeenCalledTimes(1)
  })

  it('does not log the "search account creation" analytics event simply on mount when the user has zero searches', function() {
    const LogSearchAccountCreationComponent = require('js/components/Search/LogSearchAccountCreationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.searches = 0
    shallow(<LogSearchAccountCreationComponent {...mockProps} />)
    expect(searchForACauseAccountCreated).not.toHaveBeenCalled()
  })

  it('does not log the "search account creation" analytics event simply on mount when the user has zero searches', function() {
    const LogSearchAccountCreationComponent = require('js/components/Search/LogSearchAccountCreationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.searches = 1
    shallow(<LogSearchAccountCreationComponent {...mockProps} />)
    expect(searchForACauseAccountCreated).not.toHaveBeenCalled()
  })

  it('does not log the "search account creation" analytics event when this is the user\'s second search`', function() {
    const LogSearchAccountCreationComponent = require('js/components/Search/LogSearchAccountCreationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.searches = 1
    const wrapper = shallow(
      <LogSearchAccountCreationComponent {...mockProps} />
    )
    wrapper.setProps({
      ...mockProps,
      user: {
        ...mockProps.user,
        searches: 2,
      },
    })
    expect(searchForACauseAccountCreated).not.toHaveBeenCalled()
  })
})
