/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

import { replaceUrl } from 'navigation/navigation'

jest.mock('navigation/navigation')

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
})
