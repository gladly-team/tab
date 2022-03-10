/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import gtag from 'js/analytics/google-analytics'
import { accountCreated } from 'js/analytics/logEvent'

jest.mock('js/analytics/logEvent')
jest.mock('js/analytics/google-analytics')

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogAccountCreation component', function() {
  it('logs the "account creation" analytics event when this is the user\'s first tab', function() {
    const LogAccountCreationComponent = require('js/components/Dashboard/LogAccountCreationComponent')
      .default
    const mockUserData = {
      userId: 'some-user-id-123',
      tabs: 0,
    }
    shallow(<LogAccountCreationComponent user={mockUserData} />)
    expect(accountCreated).toHaveBeenCalledTimes(1)
  })

  it('does not log the "account creation" analytics event when this is not the user\'s first tab', function() {
    const LogAccountCreationComponent = require('js/components/Dashboard/LogAccountCreationComponent')
      .default
    const mockUserData = {
      userId: 'some-user-id-123',
      tabs: 1,
    }
    shallow(<LogAccountCreationComponent user={mockUserData} />)
    expect(accountCreated).not.toHaveBeenCalled()
  })

  it('sets the Google Analytics user ID property when one exists', function() {
    const LogAccountCreationComponent = require('js/components/Dashboard/LogAccountCreationComponent')
      .default
    const mockUserData = {
      userId: 'abc-123',
      tabs: 1,
    }
    shallow(<LogAccountCreationComponent user={mockUserData} />)
    expect(gtag).toHaveBeenCalledWith('set', 'user_properties', {
      tfac_user_id: 'abc-123',
    })
  })

  it('does not set the Google Analytics user ID property when the user is not defined', function() {
    const LogAccountCreationComponent = require('js/components/Dashboard/LogAccountCreationComponent')
      .default

    // Suppress expected error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    const mockUserData = undefined
    shallow(<LogAccountCreationComponent user={mockUserData} />)
    expect(gtag).not.toHaveBeenCalled()
  })
})
