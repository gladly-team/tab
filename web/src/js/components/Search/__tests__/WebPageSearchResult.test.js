/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockBingWebPageResult } from 'js/utils/test-utils-search'

// TODO: add tests

const getMockProps = () => ({
  item: getMockBingWebPageResult(),
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('WebPageSearchResult', () => {
  it('renders without error', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<WebPageSearchResult {...mockProps} />)
  })
})
