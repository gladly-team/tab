/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockBingNewsArticleResult } from 'js/utils/test-utils-search'

// TODO: add tests

const getMockProps = () => ({
  newsItems: [getMockBingNewsArticleResult(), getMockBingNewsArticleResult()],
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('NewsSearchResults', () => {
  it('renders without error', () => {
    const NewsSearchResults = require('js/components/Search/NewsSearchResults')
      .default
    const mockProps = getMockProps()
    shallow(<NewsSearchResults {...mockProps} />)
  })
})
