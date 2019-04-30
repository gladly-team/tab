/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'

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

  it('shows the expected error message', () => {
    const SearchResultErrorMessage = require('js/components/Search/SearchResultErrorMessage')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchResultErrorMessage {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .filterWhere(
          n => n.render().text() === 'Unable to search at this time.'
        )
        .exists()
    ).toBe(true)
  })

  it('shows a button to search Google when there is an unexpected error', () => {
    const SearchResultErrorMessage = require('js/components/Search/SearchResultErrorMessage')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchResultErrorMessage {...mockProps} />)
    expect(
      wrapper
        .find(Button)
        .first()
        .render()
        .text()
    ).toEqual('Search Google')
  })

  it("links to Google's homepage when no query is provided", () => {
    const SearchResultErrorMessage = require('js/components/Search/SearchResultErrorMessage')
      .default
    const mockProps = getMockProps()
    mockProps.query = null
    const wrapper = shallow(<SearchResultErrorMessage {...mockProps} />)
    expect(
      wrapper
        .find(Link)
        .first()
        .prop('to')
    ).toEqual('https://www.google.com')
  })

  it('links to a Google search result when a query is provided', () => {
    const SearchResultErrorMessage = require('js/components/Search/SearchResultErrorMessage')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    const wrapper = shallow(<SearchResultErrorMessage {...mockProps} />)
    expect(
      wrapper
        .find(Link)
        .first()
        .prop('to')
    ).toEqual('https://www.google.com/search?q=ice%20cream')
  })
})
