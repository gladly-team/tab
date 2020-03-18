/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import LogTabMutation from 'js/mutations/LogTabMutation'
import { incrementTabsOpenedToday } from 'js/utils/local-user-data-mgr'
import logger from 'js/utils/logger'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('js/mutations/LogTabMutation')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/utils/logger')

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogTabComponent', function() {
  it('renders without error and does not have any DOM elements', () => {
    const LogTabComponent = require('js/components/Dashboard/LogTabComponent')
      .default
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
    const LogTabComponent = require('js/components/Dashboard/LogTabComponent')
      .default
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
    expect(LogTabMutation).toHaveBeenCalledWith({
      userId: mockUserData.id,
      tabId,
    })
  })

  it('calls logger.error if LogTabMutation fails', async () => {
    expect.assertions(1)
    const LogTabComponent = require('js/components/Dashboard/LogTabComponent')
      .default
    const mockRelayEnvironment = {}
    const mockUserData = { id: 'abcdefghijklmno' }
    const tabId = 'abc-123'

    // Mock that logging the tab throws an error.
    const mockErr = new Error('Tab shall not be logged.')
    LogTabMutation.mockRejectedValueOnce(mockErr)

    jest.useFakeTimers()
    shallow(
      <LogTabComponent
        user={mockUserData}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    jest.runAllTimers()
    await flushAllPromises()
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })

  it("updates today's tab count in localStorage", () => {
    const LogTabComponent = require('js/components/Dashboard/LogTabComponent')
      .default
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
    expect(incrementTabsOpenedToday).toHaveBeenCalled()
  })
})
