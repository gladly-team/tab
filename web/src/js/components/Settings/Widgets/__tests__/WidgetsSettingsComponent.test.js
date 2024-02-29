/* eslint-env jest */

import React from 'react'
import { Helmet } from 'react-helmet'
import { shallow, mount } from 'enzyme'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Toggle from 'material-ui/Toggle'
import defaultThemeLegacy from 'js/theme/default'
import { YAHOO_USER_ID } from 'js/constants'

const legacyMuiTheme = getMuiTheme(defaultThemeLegacy)

const getMockProps = () => ({
  app: {
    widgets: {
      edges: [
        {
          node: {
            id: 'fake-widget-id-bookmarks',
            name: 'Bookmarks',
            type: 'bookmarks',
          },
        },
      ],
    },
  },
  user: {
    widgets: {
      edges: [
        {
          node: {
            id: 'fake-widget-id-bookmarks',
            data: {},
          },
        },
      ],
    },
  },
  showError: jest.fn(),
})

describe('WidgetsSettings', () => {
  it('renders without error', () => {
    const WidgetsSettings = require('js/components/Settings/Widgets/WidgetsSettingsComponent')
      .default
    const mockProps = getMockProps()
    shallow(<WidgetsSettings {...mockProps} />)
  })

  it('sets the the page title', async () => {
    const WidgetsSettings = require('js/components/Settings/Widgets/WidgetsSettingsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<WidgetsSettings {...mockProps} />)
    expect(
      wrapper
        .find(Helmet)
        .find('title')
        .first()
        .text()
    ).toEqual('Widget Settings')
  })
})

const getMockYahooDemoProps = () => ({
  app: {
    widgets: {
      edges: [
        {
          node: {
            id: 'fake-widget-id-search',
            data: {},
            name: 'Search',
            type: 'search',
            settings:
              '[{"field":"engine","type":"choices","choices":["Google","Bing","DuckDuckGo","Ecosia", "Kagi"],"defaultValue":"Google","display":"Search engine"}]',
          },
        },
      ],
    },
  },
  user: {
    widgets: {
      edges: [
        {
          node: {
            id: 'fake-widget-id-search',
            data: {},
            name: 'Search',
            enabled: true,
            settings:
              '[{"field":"engine","type":"choices","choices":["Google","Bing","DuckDuckGo","Ecosia","Kagi"],"defaultValue":"Google","display":"Search engine"}]',
          },
        },
      ],
    },
    id: YAHOO_USER_ID,
  },
  showError: jest.fn(),
})

describe('WidgetsSettings: Yahoo search demo', () => {
  it('shows a Yahoo search setting for the Yahoo demo user', () => {
    const WidgetsSettings = require('js/components/Settings/Widgets/WidgetsSettingsComponent')
      .default
    const mockProps = getMockYahooDemoProps()
    const wrapper = mount(
      <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
        <WidgetsSettings {...mockProps} />
      </V0MuiThemeProvider>
    )
    expect(
      wrapper
        .find('label')
        .filterWhere(e => e.text() === 'Yahoo')
        .exists()
    ).toBe(true)
  })

  it('does NOT show a Yahoo search setting for a non-Yahoo-demo user', () => {
    const WidgetsSettings = require('js/components/Settings/Widgets/WidgetsSettingsComponent')
      .default
    const mockProps = getMockYahooDemoProps()
    const wrapper = mount(
      <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
        <WidgetsSettings
          {...{
            ...mockProps,
            user: {
              ...mockProps.user,
              id: 'some-other-user-id',
            },
          }}
        />
      </V0MuiThemeProvider>
    )
    expect(
      wrapper
        .find('label')
        .filterWhere(e => e.text() === 'Yahoo')
        .exists()
    ).toBe(false)
  })

  it('hides the search toggle for the Yahoo demo user', () => {
    const WidgetsSettings = require('js/components/Settings/Widgets/WidgetsSettingsComponent')
      .default
    const mockProps = getMockYahooDemoProps()
    const wrapper = mount(
      <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
        <WidgetsSettings {...mockProps} />
      </V0MuiThemeProvider>
    )
    expect(wrapper.find(Toggle).length).toBe(0)
  })

  it('does NOT hide the search toggle for a non-Yahoo-demo user', () => {
    const WidgetsSettings = require('js/components/Settings/Widgets/WidgetsSettingsComponent')
      .default
    const mockProps = getMockYahooDemoProps()
    const wrapper = mount(
      <V0MuiThemeProvider muiTheme={legacyMuiTheme}>
        <WidgetsSettings
          {...{
            ...mockProps,
            user: {
              ...mockProps.user,
              id: 'some-other-user-id',
            },
          }}
        />
      </V0MuiThemeProvider>
    )
    expect(wrapper.find(Toggle).length).toBe(1)
  })
})
