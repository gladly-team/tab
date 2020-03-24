/* eslint-env jest */

import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { mount, shallow } from 'enzyme'
import TextField from 'material-ui/TextField'
import { flushAllPromises } from 'js/utils/test-utils'
import { searchExecuted } from 'js/analytics/logEvent'

jest.mock('js/analytics/logEvent')
jest.mock('js/analytics/google-analytics')
jest.mock('js/analytics/facebook-analytics')

function getMockProps() {
  return {
    user: {
      id: 'abc123',
    },
    widget: {
      id: 'widget-xyz',
      name: 'Search',
      enabled: true,
      config: JSON.stringify({
        engine: 'Google',
      }),
      data: JSON.stringify({}),
      settings: JSON.stringify([
        {
          choices: ['Google', 'Bing', 'DuckDuckGo', 'Ecosia'],
          defaultValue: 'Google',
          display: 'Search engine',
          field: 'engine',
          type: 'choices',
        },
      ]),
      type: 'search',
    },
  }
}

const windowOpenMock = jest.spyOn(window, 'open').mockImplementation(() => {})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Search widget  component', () => {
  it('renders without error', () => {
    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockProps()
    shallow(<SearchWidget {...mockProps} />)
  })

  it('executes a Google search', async () => {
    expect.assertions(1)

    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockProps()

    // After updating to Material UI 1.x, we shouldn't have to wrap our tested
    // components in the MuiThemeProvider.
    // https://github.com/mui-org/material-ui/issues/5330#issuecomment-251843011
    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    searchInput.simulate('click')
    searchInput.instance().value = 'taco'
    searchInput.simulate('keypress', { key: 'Enter' })
    await flushAllPromises()
    expect(windowOpenMock).toHaveBeenCalledWith(
      'https://www.google.com/search?q=taco',
      '_top'
    )
  })

  it('executes a Bing search', async () => {
    expect.assertions(1)

    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockProps()
    mockProps.widget.config = JSON.stringify({
      engine: 'Bing',
    })

    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    searchInput.simulate('click')
    searchInput.instance().value = 'yogurt'
    searchInput.simulate('keypress', { key: 'Enter' })
    await flushAllPromises()
    expect(windowOpenMock).toHaveBeenCalledWith(
      'https://www.bing.com/search?q=yogurt',
      '_top'
    )
  })

  it('executes a DuckDuckGo search', async () => {
    expect.assertions(1)

    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockProps()
    mockProps.widget.config = JSON.stringify({
      engine: 'DuckDuckGo',
    })

    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    searchInput.simulate('click')
    searchInput.instance().value = 'yogurt'
    searchInput.simulate('keypress', { key: 'Enter' })
    await flushAllPromises()
    expect(windowOpenMock).toHaveBeenCalledWith(
      'https://duckduckgo.com/?q=yogurt',
      '_top'
    )
  })

  it('executes an Ecosia search', async () => {
    expect.assertions(1)

    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockProps()
    mockProps.widget.config = JSON.stringify({
      engine: 'Ecosia',
    })

    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    searchInput.simulate('click')
    searchInput.instance().value = 'carrot'
    searchInput.simulate('keypress', { key: 'Enter' })
    await flushAllPromises()
    expect(windowOpenMock).toHaveBeenCalledWith(
      'https://www.ecosia.org/search?q=carrot',
      '_top'
    )
  })

  it('logs a search event', async () => {
    expect.assertions(2)

    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockProps()

    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    searchInput.simulate('click')
    searchInput.instance().value = 'taco'
    searchInput.simulate('keypress', { key: 'Enter' })
    await flushAllPromises()
    expect(searchExecuted).toHaveBeenCalledWith()
    expect(searchExecuted).toHaveBeenCalledTimes(1)
  })
})
