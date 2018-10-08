/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

import { replaceUrl } from 'js/navigation/navigation'
import {
  setBrowserExtensionInstallId,
  setBrowserExtensionInstallTime
} from 'js/utils/local-user-data-mgr'
import {
  assignUserToTestGroups
} from 'js/utils/experiments'

jest.mock('js/navigation/navigation')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/utils/experiments')

afterEach(() => {
  jest.clearAllMocks()
})

const mockProps = {}

describe('FirstTabView', function () {
  it('renders without error', () => {
    const FirstTabView = require('../FirstTabView').default
    shallow(
      <FirstTabView {...mockProps} />
    )
  })

  it('redirects to the dashboard on mount', () => {
    const FirstTabView = require('../FirstTabView').default
    shallow(
      <FirstTabView {...mockProps} />
    )
    expect(replaceUrl).toHaveBeenCalledWith('/newtab/')
  })

  it('calls to set the extension install ID in local storage', () => {
    const FirstTabView = require('../FirstTabView').default
    shallow(
      <FirstTabView {...mockProps} />
    )
    expect(setBrowserExtensionInstallId).toHaveBeenCalledTimes(1)
  })

  it('calls to set the extension install time in local storage', () => {
    const FirstTabView = require('../FirstTabView').default
    shallow(
      <FirstTabView {...mockProps} />
    )
    expect(setBrowserExtensionInstallTime).toHaveBeenCalledTimes(1)
  })

  it('calls to set the user\'s test groups for any ongoing split-tests', () => {
    const FirstTabView = require('../FirstTabView').default
    shallow(
      <FirstTabView {...mockProps} />
    )
    expect(assignUserToTestGroups).toHaveBeenCalledTimes(1)
  })
})
