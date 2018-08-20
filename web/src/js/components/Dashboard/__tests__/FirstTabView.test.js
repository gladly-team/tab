/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

import { replaceUrl } from 'navigation/navigation'
import {
  setBrowserExtensionInstallTime
} from 'utils/local-user-data-mgr'

jest.mock('navigation/navigation')
jest.mock('utils/local-user-data-mgr')

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

  it('calls to set the extension install time', () => {
    const FirstTabView = require('../FirstTabView').default
    shallow(
      <FirstTabView {...mockProps} />
    )
    expect(setBrowserExtensionInstallTime).toHaveBeenCalledTimes(1)
  })
})
