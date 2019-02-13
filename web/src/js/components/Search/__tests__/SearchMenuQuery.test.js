/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'

jest.mock('react-relay')
jest.mock('js/components/General/withUserId')
jest.mock('js/analytics/logEvent')
jest.mock('js/components/Search/SearchMenuContainer')

afterEach(() => {
  jest.resetModules()
})

describe('SearchMenuQuery', () => {
  it('renders without error', () => {
    const SearchMenuQuery = require('js/components/Search/SearchMenuQuery')
      .default
    shallow(<SearchMenuQuery />).dive()
  })

  it('includes QueryRenderer', () => {
    const SearchMenuQuery = require('js/components/Search/SearchMenuQuery')
      .default
    const wrapper = mount(<SearchMenuQuery />)
    const { QueryRenderer } = require('react-relay')
    expect(wrapper.find(QueryRenderer).length).toBe(1)
  })

  it('QueryRenderer has the "variables" prop when the user is authenticated', () => {
    const withUserId = require('js/components/General/withUserId').default
    withUserId.mockImplementation(options => ChildComponent => props => (
      <ChildComponent userId={'abc123xyz456'} {...props} />
    ))
    const SearchMenuQuery = require('js/components/Search/SearchMenuQuery')
      .default
    const wrapper = mount(<SearchMenuQuery />)
    const { QueryRenderer } = require('react-relay')
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'abc123xyz456', // default value in withUserId mock
    })
  })

  it('QueryRenderer does not have the "variables" prop when the user is not authenticated', () => {
    const withUserId = require('js/components/General/withUserId').default
    withUserId.mockImplementation(options => ChildComponent => props => (
      <ChildComponent userId={null} {...props} />
    ))

    const SearchMenuQuery = require('js/components/Search/SearchMenuQuery')
      .default
    const wrapper = mount(<SearchMenuQuery />)
    const { QueryRenderer } = require('react-relay')
    expect(wrapper.find(QueryRenderer).prop('variables')).not.toBeDefined()
  })

  it('passes "app", "user", "location" props to the child container when they exist', () => {
    const fakeProps = {
      app: {
        some: 'value',
      },
      user: {
        id: 'abc123xyz456',
        vc: 233,
      },
    }
    const { QueryRenderer } = require('react-relay')
    QueryRenderer.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: jest.fn(),
    })

    const SearchMenuQuery = require('js/components/Search/SearchMenuQuery')
      .default
    const wrapper = mount(
      <SearchMenuQuery
        location={{
          search: '?q=tacos',
        }}
      />
    )
    const SearchMenuContainer = require('js/components/Search/SearchMenuContainer')
      .default
    const containerElem = wrapper.find(SearchMenuContainer)
    expect(containerElem.prop('app')).toEqual(fakeProps.app)
    expect(containerElem.prop('user')).toEqual(fakeProps.user)
    expect(containerElem.prop('location')).toEqual({
      search: '?q=tacos',
    })
  })

  it('does not render child if "app" props do not exist', () => {
    const fakeProps = {
      app: null,
    }
    const { QueryRenderer } = require('react-relay')
    QueryRenderer.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: jest.fn(),
    })

    const SearchMenuQuery = require('js/components/Search/SearchMenuQuery')
      .default
    const wrapper = mount(
      <SearchMenuQuery
        location={{
          search: '?q=tacos',
        }}
      />
    )
    const SearchMenuContainer = require('js/components/Search/SearchMenuContainer')
      .default
    expect(wrapper.find(SearchMenuContainer).length).toBe(0)
  })
})
