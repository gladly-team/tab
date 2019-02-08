/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'

jest.mock('react-relay')
jest.mock('js/components/General/withUserId')
jest.mock('js/analytics/logEvent')
jest.mock('js/components/Search/SearchPageContainer')

afterEach(() => {
  jest.resetModules()
})

describe('SearchView', () => {
  it('renders without error', () => {
    const SearchView = require('js/components/Search/SearchView').default
    shallow(<SearchView />).dive()
  })
})
