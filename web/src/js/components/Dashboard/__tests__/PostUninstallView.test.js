/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

import { externalRedirect } from 'navigation/navigation'

jest.mock('navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

const mockProps = {}

describe('PostUninstallView', function () {
  it('renders without error', () => {
    const PostUninstallView = require('../PostUninstallView').default
    shallow(
      <PostUninstallView {...mockProps} />
    )
  })

  it('redirects to the survey doc on mount', () => {
    const PostUninstallView = require('../PostUninstallView').default
    shallow(
      <PostUninstallView {...mockProps} />
    )
    expect(externalRedirect).toHaveBeenCalledWith('https://goo.gl/forms/XUICFx9psTwCzEIE2')
  })
})
