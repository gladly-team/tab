/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import DashboardView from '../DashboardView'
import AuthUserComponent from 'general/AuthUserComponent'
import {
  QueryRenderer
} from 'react-relay/compat'
import DashboardContainer from '../DashboardContainer'

jest.mock('general/AuthUserComponent')
jest.mock('analytics/logEvent')
jest.mock('react-relay/compat')
jest.mock('../DashboardContainer')

afterEach(() => {
  jest.clearAllMocks()
})

describe('DashboardView', () => {
  it('renders without error', () => {
    shallow(
      <DashboardView />
    )
  })

  it('includes AuthUserComponent', () => {
    const wrapper = shallow(
      <DashboardView />
    )
    expect(wrapper.find(AuthUserComponent).length).toBe(1)
  })

  it('includes QueryRenderer', () => {
    const wrapper = shallow(
      <DashboardView />
    )
    expect(wrapper.find(QueryRenderer).length).toBe(1)
  })

  it('renders DashboardContainer before receiving a query response', () => {
    QueryRenderer.__setQueryResponse({
      error: null,
      props: null,
      retry: jest.fn()
    })

    const wrapper = mount(
      <DashboardView />
    )
    expect(wrapper.find(DashboardContainer).length).toBe(1)
  })
})
