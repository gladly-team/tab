/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'

jest.mock('react-relay')
jest.mock('js/components/General/withUserId')
jest.mock('js/analytics/logEvent')
jest.mock('js/components/Search/SearchContainer')

afterEach(() => {
  jest.resetModules()
})

describe('SearchView', () => {
  it('renders without error', () => {
    const SearchView = require('js/components/Search/SearchView').default
    shallow(
      <SearchView />
    ).dive()
  })

  it('includes QueryRenderer', () => {
    const SearchView = require('js/components/Search/SearchView').default
    const wrapper = mount(
      <SearchView />
    )
    const { QueryRenderer } = require('react-relay')
    expect(wrapper.find(QueryRenderer).length).toBe(1)
  })

  it('QueryRenderer has the "variables" prop when the user is authenticated', () => {
    const withUserId = require('js/components/General/withUserId').default
    withUserId.mockImplementation(options => ChildComponent => props => (
      <ChildComponent userId={'abc123xyz456'} {...props} />
    ))
    const SearchView = require('js/components/Search/SearchView').default
    const wrapper = mount(
      <SearchView />
    )
    const { QueryRenderer } = require('react-relay')
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'abc123xyz456' // default value in withUserId mock
    })
  })

  it('QueryRenderer does not have the "variables" prop when the user is not authenticated', () => {
    const withUserId = require('js/components/General/withUserId').default
    withUserId.mockImplementation(options => ChildComponent => props => (
      <ChildComponent userId={null} {...props} />
    ))

    const SearchView = require('js/components/Search/SearchView').default
    const wrapper = mount(
      <SearchView />
    )
    const { QueryRenderer } = require('react-relay')
    expect(wrapper.find(QueryRenderer).prop('variables')).not.toBeDefined()
  })

  it('passes "app", "user", "location" props to the SearchContainer when they exist', () => {
    const fakeProps = {
      app: {
        some: 'value'
      },
      user: {
        id: 'abc123xyz456',
        vc: 233
      }
    }
    const { QueryRenderer } = require('react-relay')
    QueryRenderer.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: jest.fn()
    })

    const SearchView = require('js/components/Search/SearchView').default
    const wrapper = mount(
      <SearchView
        location={{
          search: '?q=tacos'
        }}
      />
    )
    const SearchContainer = require('js/components/Search/SearchContainer').default
    const searchPageContainer = wrapper.find(SearchContainer)
    expect(searchPageContainer.prop('app')).toEqual(fakeProps.app)
    expect(searchPageContainer.prop('user')).toEqual(fakeProps.user)
    expect(searchPageContainer.prop('location')).toEqual({
      search: '?q=tacos'
    })
  })
})
