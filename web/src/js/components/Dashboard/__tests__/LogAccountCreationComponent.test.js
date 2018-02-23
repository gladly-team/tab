/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

import {
  accountCreated
} from 'analytics/logEvent'

jest.mock('analytics/logEvent')

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogAccountCreation component', function () {
  it('logs the "account creation" analytics event when this is the user\'s first tab', function () {
    const LogAccountCreationComponent = require('../LogAccountCreationComponent').default
    const mockUserData = {
      tabs: 0
    }
    shallow(
      <LogAccountCreationComponent
        user={mockUserData}
        />
    )
    expect(accountCreated).toHaveBeenCalledTimes(1)
  })

  it('does not log the "account creation" analytics event when this is not the user\'s first tab', function () {
    const LogAccountCreationComponent = require('../LogAccountCreationComponent').default
    const mockUserData = {
      tabs: 1
    }
    shallow(
      <LogAccountCreationComponent
        user={mockUserData}
        />
    )
    expect(accountCreated).not.toHaveBeenCalled()
  })
})
