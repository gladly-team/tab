/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { goTo, searchBaseURL } from 'js/navigation/navigation'

jest.mock('js/navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({})

describe('SearchRandomQueryView', function() {
  it('renders without error', () => {
    const SearchRandomQueryView = require('js/components/Search/SearchRandomQueryView')
      .default
    shallow(<SearchRandomQueryView {...getMockProps()} />)
  })

  it('redirects to the search page', () => {
    const SearchRandomQueryView = require('js/components/Search/SearchRandomQueryView')
      .default
    shallow(<SearchRandomQueryView {...getMockProps()} />)
    expect(goTo).toHaveBeenCalledWith(searchBaseURL)
  })
})
