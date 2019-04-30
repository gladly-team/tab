/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
// import Link from 'js/components/General/Link'

jest.mock('js/components/General/Link')

const getMockProps = () => ({
  query: null,
})

describe('SearchResultErrorMessage', () => {
  it('renders without error', () => {
    const SearchResultErrorMessage = require('js/components/Search/SearchResultErrorMessage')
      .default
    const mockProps = getMockProps()
    shallow(<SearchResultErrorMessage {...mockProps} />)
  })
})
