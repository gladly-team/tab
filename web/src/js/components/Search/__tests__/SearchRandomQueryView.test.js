/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { goTo, searchBaseURL } from 'js/navigation/navigation'

jest.mock('js/navigation/navigation')

let mathRandomMock
beforeEach(() => {
  // Control for randomness.
  mathRandomMock = jest.spyOn(Math, 'random').mockReturnValue(0)
})

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
    expect(goTo).toHaveBeenCalledWith(searchBaseURL, expect.any(Object))
  })

  it('uses a randomly-selected search query', () => {
    const SearchRandomQueryView = require('js/components/Search/SearchRandomQueryView')
      .default

    // Mock selecting the first item.
    mathRandomMock.mockReturnValue(0)
    shallow(<SearchRandomQueryView {...getMockProps()} />)
    expect(goTo).toHaveBeenCalledWith('/search', {
      q: 'volunteer opportunities near me',
    })
    goTo.mockClear()

    // Mock selecting the last item.
    mathRandomMock.mockReturnValue(0.99)
    shallow(<SearchRandomQueryView {...getMockProps()} />)
    expect(goTo).toHaveBeenCalledWith('/search', {
      q: 'ways to make someone smile',
    })
  })
})
