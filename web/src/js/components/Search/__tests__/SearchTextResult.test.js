/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

const getMockProps = () => ({
  result: {
    title: 'Some search result',
    linkURL: 'http://www.example.com',
    snippet: 'This is the search result description.'
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SearchTextResult page component', () => {
  it('renders without error', () => {
    const SearchTextResult = require('js/components/Search/SearchTextResult').default
    const mockProps = getMockProps()
    shallow(
      <SearchTextResult {...mockProps} />
    )
  })

  it('displays the title as a clickable link', () => {
    const SearchTextResult = require('js/components/Search/SearchTextResult').default
    const mockProps = getMockProps()
    mockProps.result.title = 'Hey, click to our site!'
    const wrapper = shallow(
      <SearchTextResult {...mockProps} />
    )
    const anchor = wrapper.find(`a[href="${mockProps.result.linkURL}"]`).first()
    expect(anchor.find('h3').first().text()).toEqual('Hey, click to our site!')
  })

  it('displays the link URL', () => {
    const SearchTextResult = require('js/components/Search/SearchTextResult').default
    const mockProps = getMockProps()
    mockProps.result.linkURL = 'https://example.io'
    const wrapper = shallow(
      <SearchTextResult {...mockProps} />
    )
    const linkURL = wrapper
      .find('div')
      .filterWhere(n => n.text() === 'https://example.io')
    expect(linkURL.length).toBe(1)
  })

  it('displays the snippet text', () => {
    const SearchTextResult = require('js/components/Search/SearchTextResult').default
    const mockProps = getMockProps()
    mockProps.result.snippet = 'Hi there!'
    const wrapper = shallow(
      <SearchTextResult {...mockProps} />
    )
    const snippetElem = wrapper
      .find('div')
      .filterWhere(n => n.text() === 'Hi there!')
    expect(snippetElem.length).toBe(1)
  })
})
