/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'

import LogTabMutation from 'mutations/LogTabMutation'

jest.mock('mutations/LogTabMutation')

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogTabComponent', function () {
  it('renders without error and does not have any DOM elements', () => {
    const LogTabComponent = require('../LogTabComponent').default
    const wrapper = shallow(
      <LogTabComponent
        user={{ id: 'abcdefghijklmno' }}
        tabId={'abc-123'}
        relay={{ environment: {} }}
        />
    )
    expect(toJson(wrapper)).toEqual('')
  })

  it('logs the tab after a 1 second timeout', () => {
    const LogTabComponent = require('../LogTabComponent').default
    const mockRelayEnvironment = {}
    const mockUserData = { id: 'abcdefghijklmno' }
    const tabId = 'abc-123'
    jest.useFakeTimers()
    shallow(
      <LogTabComponent
        user={mockUserData}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
        />
    )
    jest.advanceTimersByTime(999)
    expect(LogTabMutation).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1)
    expect(LogTabMutation).toHaveBeenCalledWith(mockRelayEnvironment,
      mockUserData.id, tabId)
  })
})
