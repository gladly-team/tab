/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { goTo } from 'js/navigation/navigation'

jest.mock('js/navigation/navigation')
jest.mock('js/navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

const mockProps = {}

describe('PostUninstallView', function() {
  it('renders without error', () => {
    const PostUninstallView = require('js/components/Dashboard/PostUninstallView')
      .default
    shallow(<PostUninstallView {...mockProps} />)
  })

  it('redirects to the survey doc on mount', () => {
    const PostUninstallView = require('js/components/Dashboard/PostUninstallView')
      .default
    shallow(<PostUninstallView {...mockProps} />)
    expect(goTo).toHaveBeenCalledWith('https://goo.gl/forms/XUICFx9psTwCzEIE2')
  })
})
