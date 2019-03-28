/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { externalRedirect } from 'js/navigation/utils'

jest.mock('js/navigation/navigation')
jest.mock('js/navigation/utils')

afterEach(() => {
  jest.clearAllMocks()
})

const mockProps = {}

describe('SearchPostUninstallView', function() {
  it('renders without error', () => {
    const SearchPostUninstallView = require('js/components/Search/SearchPostUninstallView')
      .default
    shallow(<SearchPostUninstallView {...mockProps} />)
  })

  it('redirects to the survey doc on mount', () => {
    const SearchPostUninstallView = require('js/components/Search/SearchPostUninstallView')
      .default
    shallow(<SearchPostUninstallView {...mockProps} />)
    expect(externalRedirect).toHaveBeenCalledWith(
      'https://forms.gle/A3Xam2op2gFjoQNU6'
    )
  })
})
