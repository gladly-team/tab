/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

afterEach(() => {
  jest.resetModules()
  delete process.env.REACT_APP_WHICH_APP
})

describe('root.js', () => {
  it('creates the expected route when app = "newtab"', () => {
    process.env.REACT_APP_WHICH_APP = 'newtab'
    const { Route } = require('react-router-dom')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    expect(
      wrapper
        .find(Route)
        .first()
        .prop('path')
    ).toEqual('/newtab/')
  })

  it('uses the expected component when app = "newtab"', () => {
    process.env.REACT_APP_WHICH_APP = 'newtab'
    const { Route } = require('react-router-dom')
    const Root = require('js/root').default
    const NewTabApp = require('js/components/App/App').default
    const wrapper = shallow(<Root />)
    expect(
      wrapper
        .find(Route)
        .first()
        .prop('component')
    ).toEqual(NewTabApp)
  })

  it('creates the expected route when app = "search"', () => {
    process.env.REACT_APP_WHICH_APP = 'search'
    const { Route } = require('react-router-dom')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    expect(
      wrapper
        .find(Route)
        .first()
        .prop('path')
    ).toEqual('/search/')
  })

  it('uses the expected component when app = "search"', () => {
    process.env.REACT_APP_WHICH_APP = 'search'
    const { Route } = require('react-router-dom')
    const Root = require('js/root').default
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<Root />)
    expect(
      wrapper
        .find(Route)
        .first()
        .prop('component')
    ).toEqual(SearchApp)
  })

  it('throws an error when REACT_APP_WHICH_APP is not set to a valid value', () => {
    process.env.REACT_APP_WHICH_APP = 'blah'
    expect(() => {
      const Root = require('js/root').default
      shallow(<Root />)
    }).toThrow(
      'Env var "REACT_APP_WHICH_APP" should be set to "newtab" or "search". Received: "blah"'
    )
  })
})
