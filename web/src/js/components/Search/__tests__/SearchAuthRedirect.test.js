/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { replaceUrl } from 'js/navigation/navigation'

jest.mock('js/navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

const mockProps = {}

describe('SearchAuthRedirect', function() {
  it('renders without error', () => {
    const SearchAuthRedirect = require('js/components/Search/SearchAuthRedirect')
      .default
    shallow(<SearchAuthRedirect {...mockProps} />)
  })

  it('redirects to the auth page on mount', () => {
    const SearchAuthRedirect = require('js/components/Search/SearchAuthRedirect')
      .default
    shallow(<SearchAuthRedirect {...mockProps} />)
    expect(replaceUrl).toHaveBeenCalledWith('/newtab/auth/', { app: 'search' })
  })
})
