/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import SearchView from 'js/components/Search/SearchView'
import SearchContainer from 'js/components/Search/SearchContainer'
import AuthUserComponent from 'js/components/General/AuthUserComponent'
import {
  QueryRenderer
} from 'react-relay'

jest.mock('react-relay')
jest.mock('js/components/General/AuthUserComponent')
jest.mock('js/analytics/logEvent')
jest.mock('js/components/Search/SearchContainer')

describe('SearchView', () => {
  it('renders without error', () => {
    shallow(
      <SearchView />
    )
  })

  it('includes AuthUserComponent', () => {
    const wrapper = shallow(
      <SearchView />
    )
    expect(wrapper.find(AuthUserComponent).length).toBe(1)

    // Make sure AuthUserComponent is the top-level component.
    // We're not using Enzyme's .type() here because the
    // component is mocked.
    expect(wrapper.name()).toEqual('AuthUserComponent')
  })

  it('includes QueryRenderer', () => {
    const wrapper = shallow(
      <SearchView />
    )
    expect(wrapper.find(QueryRenderer).length).toBe(1)
  })

  it('QueryRenderer receives the "variables" prop', () => {
    const wrapper = mount(
      <SearchView />
    )
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'abc123xyz456' // default value in AuthUser mock
    })
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
    QueryRenderer.__setQueryResponse({
      error: null,
      props: fakeProps,
      retry: jest.fn()
    })

    const wrapper = mount(
      <SearchView
        location={{
          search: '?q=tacos'
        }}
      />
    )
    const searchPageContainer = wrapper.find(SearchContainer)
    expect(searchPageContainer.prop('app')).toEqual(fakeProps.app)
    expect(searchPageContainer.prop('user')).toEqual(fakeProps.user)
    expect(searchPageContainer.prop('location')).toEqual({
      search: '?q=tacos'
    })
  })
})
