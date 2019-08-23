/* eslint-env jest */

import React from 'react'
import { Helmet } from 'react-helmet'
import { shallow } from 'enzyme'
jest.mock('js/utils/client-location')

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
