/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  query: 'grand canyon',
})

describe('WikipediaQuery', () => {
  it('renders without error', () => {
    const WikipediaQuery = require('js/components/Search/WikipediaQuery')
      .default
    const mockProps = getMockProps()
    shallow(<WikipediaQuery {...mockProps} />)
  })
})
