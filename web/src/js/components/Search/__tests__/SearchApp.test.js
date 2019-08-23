/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Helmet } from 'react-helmet'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SearchAuthRedirect from 'js/components/Search/SearchAuthRedirect'
import SearchPageComponent from 'js/components/Search/SearchPageComponent'
import SearchPostUninstallView from 'js/components/Search/SearchPostUninstallView'
import SearchRandomQueryView from 'js/components/Search/SearchRandomQueryView'
import ErrorBoundary from 'js/components/General/ErrorBoundary'

jest.mock('js/components/Search/SearchPageComponent')
jest.mock('js/components/Search/SearchPostUninstallView')
jest.mock('js/components/Search/SearchRandomQueryView')
jest.mock('js/assets/logos/search-favicon.png', () => '/example/favicon.png')

describe('SearchApp', () => {
  it('renders without error', () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    shallow(<SearchApp />)
  })

  it('does not contain the legacy MUI theme provider', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    expect(wrapper.find(V0MuiThemeProvider).exists()).toBe(false)
  })

  it('contains the MUI theme provider', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    expect(wrapper.find(MuiThemeProvider).exists()).toBe(true)
  })

  it('sets the the favicon with react-helmet', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    expect(
      wrapper
        .find(Helmet)
        .find('link')
        .first()
        .prop('rel')
    ).toEqual('icon')
    expect(
      wrapper
        .find(Helmet)
        .find('link')
        .first()
        .prop('href')
    ).toEqual('/example/favicon.png')
  })

  it('sets the the titleTemplate and defaultTitle with react-helmet', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    expect(wrapper.find(Helmet).prop('titleTemplate')).toEqual(
      '%s - Search for a Cause'
    )
    expect(wrapper.find(Helmet).prop('defaultTitle')).toEqual(
      'Search for a Cause'
    )
  })

  it('contains an error boundary', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    expect(wrapper.find(ErrorBoundary).exists()).toBe(true)
    expect(wrapper.find(ErrorBoundary).prop('brand')).toEqual('search')
  })

  it('contains the main search page route', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      // Do not change this URL, because people may have linked
      // to search results.
      .filterWhere(n => n.prop('path') === '/search')
    expect(route.exists()).toBe(true)
    expect(route.prop('component')).toBe(SearchPageComponent)
  })

  it('contains the Bing testing search page route', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      .filterWhere(n => n.prop('path') === '/search/bing')
    expect(route.exists()).toBe(true)
  })

  it('sets the the Bing testing search page searchProvider to Bing', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      .filterWhere(n => n.prop('path') === '/search/bing')
    expect(route.prop('component')).not.toBeDefined()
    const RenderedComp = route.prop('render')()
    expect(RenderedComp).toEqual(
      <SearchPageComponent searchProvider={'bing'} />
    )
  })

  it('contains the Yahoo testing search page route', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      .filterWhere(n => n.prop('path') === '/search/yahoo')
    expect(route.exists()).toBe(true)
  })

  it('sets the the Yahoo testing search page searchProvider to Yahoo', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      .filterWhere(n => n.prop('path') === '/search/yahoo')
    expect(route.prop('component')).not.toBeDefined()
    const RenderedComp = route.prop('render')()
    expect(RenderedComp).toEqual(
      <SearchPageComponent searchProvider={'yahoo'} />
    )
  })

  it('contains the search browser extension post-uninstall route', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      // Do not change this URL, because the browser extensions
      // use it.
      .filterWhere(n => n.prop('path') === '/search/uninstalled/')
    expect(route.exists()).toBe(true)
    expect(route.prop('component')).toBe(SearchPostUninstallView)
  })

  it('contains the search auth redirect route', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      .filterWhere(n => n.prop('path') === '/search/auth/')
    expect(route.exists()).toBe(true)
    expect(route.prop('component')).toBe(SearchAuthRedirect)
  })

  it('contains the "random search" route', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      .filterWhere(n => n.prop('path') === '/search/random/')
    expect(route.exists()).toBe(true)
    expect(route.prop('component')).toBe(SearchRandomQueryView)
  })

  it('contains the "profile" route', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      .filterWhere(n => n.prop('path') === '/search/profile/')
    expect(route.exists()).toBe(true)

    // TODO: test the component type when Enzyme fully supports React.lazy
  })

  it('contains the "account" route', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    const route = wrapper
      .find(Route)
      .filterWhere(n => n.prop('path') === '/search/account/')
    expect(route.exists()).toBe(true)

    // TODO: test the component type when Enzyme fully supports React.lazy
  })
})
