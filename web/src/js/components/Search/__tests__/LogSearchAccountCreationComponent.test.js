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
  it('logs the "search account creation" analytics event when this is the user\'s first search', function() {
    const LogSearchAccountCreationComponent = require('js/components/Search/LogSearchAccountCreationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.searches = 1
    shallow(<LogSearchAccountCreationComponent {...mockProps} />)
    expect(searchForACauseAccountCreated).toHaveBeenCalledTimes(1)
  })

  it('does not log the "search account creation" analytics event when this is not the user\'s first tab', function() {
    const LogSearchAccountCreationComponent = require('js/components/Search/LogSearchAccountCreationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.searches = 3
    shallow(<LogSearchAccountCreationComponent {...mockProps} />)
    expect(searchForACauseAccountCreated).not.toHaveBeenCalled()
  })
})
