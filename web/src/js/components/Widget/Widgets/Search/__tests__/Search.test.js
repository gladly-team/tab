/* eslint-env jest */

import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { mount, shallow } from 'enzyme'
import TextField from 'material-ui/TextField'
import { flushAllPromises } from 'js/utils/test-utils'
import localStorageMgr from 'js/utils/localstorage-mgr'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import { YAHOO_USER_ID } from 'js/constants'
import Button from '@material-ui/core/Button'
import LogSearchMutation from 'js/mutations/LogSearchMutation'
import { getCurrentUser } from 'js/authentication/user'

jest.mock('js/mutations/LogSearchMutation')
jest.mock('js/analytics/logEvent')
jest.mock('js/analytics/facebook-analytics')
jest.mock('js/utils/localstorage-mgr', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))
jest.mock('js/authentication/user', () => ({ getCurrentUser: jest.fn() }))
function getMockProps() {
  return {
    user: {
      id: 'abc_123',
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
function getMockYahooProps() {
  return {
    user: {
      id: YAHOO_USER_ID,
    },
    widget: {
      id: 'widget-xyz',
      name: 'Search',
      enabled: true,
      config: JSON.stringify({
        engine: 'Yahoo',
      }),
      data: JSON.stringify({}),
      settings: JSON.stringify([
        {
          choices: ['Yahoo', 'Bing', 'DuckDuckGo', 'Ecosia'],
          defaultValue: 'Yahoo',
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
})
describe('Yahoo Search Demo', () => {
  it('If Yahoo user, shows user opt in popover on first visit', async () => {
    expect.assertions(2)

    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockYahooProps()
    localStorageMgr.getItem.mockReturnValueOnce(null)
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
    searchInput.simulate('click')
    wrapper.update()
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
  })

  it('If Yahoo user, does not show opt in popover after acknowledged', async () => {
    expect.assertions(2)

    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockYahooProps()
    localStorageMgr.getItem.mockReturnValueOnce('true')
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
    searchInput.simulate('click')
    wrapper.update()
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
  })

  it('If Yahoo user, clicking yes dismisses dropdown and updates local storage', async () => {
    expect.assertions(4)

    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockYahooProps()
    localStorageMgr.getItem.mockReturnValueOnce(null)
    getCurrentUser.mockReturnValueOnce({ id: YAHOO_USER_ID })
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
    searchInput.simulate('click')
    wrapper.update()
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
    wrapper
      .find(Button)
      .at(2)
      .simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.yahoo.searchdemo',
      'true'
    )
  })

  it('If Yahoo user, clicking no dismisses dropdown and udpates local storage', async () => {
    expect.assertions(4)

    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockYahooProps()
    localStorageMgr.getItem.mockReturnValueOnce(null)
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
    searchInput.simulate('click')
    wrapper.update()
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
    wrapper
      .find(Button)
      .at(1)
      .simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.yahoo.searchdemo',
      'false'
    )
  })

  it('If Yahoo user, clicking yes logs a tab on successful search', async () => {
    expect.assertions(2)
    const SearchWidget = require('js/components/Widget/Widgets/Search/Search')
      .default
    const mockProps = getMockYahooProps()
    localStorageMgr.getItem
      .mockReturnValueOnce(null)
      .mockReturnValueOnce('true')
    const wrapper = mount(
      <MuiThemeProvider>
        <SearchWidget {...mockProps} />
      </MuiThemeProvider>
    )
    const searchInput = wrapper.find(TextField).find('input')
    searchInput.simulate('click')
    wrapper.update()
    wrapper
      .find(Button)
      .at(2)
      .simulate('click')
    wrapper.update()
    searchInput.simulate('click')
    searchInput.instance().value = 'taco'
    searchInput.simulate('keypress', { key: 'Enter' })
    await flushAllPromises()
    expect(windowOpenMock).toHaveBeenCalledWith(
      'https://tab.gladly.io/search?src=legacy&q=taco',
      '_top'
    )
    expect(LogSearchMutation).toHaveBeenCalled()
  })
})
