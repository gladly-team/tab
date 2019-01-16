/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { cloneDeep } from 'lodash/lang'

jest.mock('js/analytics/logEvent')
jest.mock('js/analytics/google-analytics')
jest.mock('js/analytics/facebook-analytics')

const mockUserData = {
  id: 'user-abc-123',
  activeWidget: 'fake-widget-id-bookmarks',
  widgets: {
    edges: [
      {
        node: {
          id: 'fake-widget-id-bookmarks',
          type: 'bookmarks',
        },
      },
      {
        node: {
          id: 'fake-widget-id-notes',
          type: 'notes',
        },
      },
      {
        node: {
          id: 'fake-widget-id-todos',
          type: 'todos',
        },
      },
      {
        node: {
          id: 'fake-widget-id-clock',
          type: 'clock',
        },
      },
    ],
  },
}

const mockShowError = () => {}

describe('Widgets component', function() {
  it('renders without error', function() {
    const WidgetsComponent = require('js/components/Widget/WidgetsComponent')
      .default
    const userData = cloneDeep(mockUserData)
    shallow(<WidgetsComponent user={userData} showError={mockShowError} />)
  })

  it('shows the center widgets (i.e. clock) when no campaign is running', function() {
    const WidgetsComponent = require('js/components/Widget/WidgetsComponent')
      .default
    const userData = {
      id: 'user-abc-123',
      activeWidget: null,
      widgets: {
        edges: [
          {
            node: {
              id: 'fake-widget-id-clock',
              type: 'clock',
            },
          },
        ],
      },
    }
    const wrapper = shallow(
      <WidgetsComponent
        user={userData}
        isCampaignLive={false}
        showError={mockShowError}
      />
    )
    expect(wrapper.find('[data-test-id="widget-clock"]').length).toBe(1)
  })

  it('hides the center widgets (i.e. clock) when a campaign is running', function() {
    const WidgetsComponent = require('js/components/Widget/WidgetsComponent')
      .default
    const userData = {
      id: 'user-abc-123',
      activeWidget: null,
      widgets: {
        edges: [
          {
            node: {
              id: 'fake-widget-id-clock',
              type: 'clock',
            },
          },
        ],
      },
    }
    const wrapper = shallow(
      <WidgetsComponent
        user={userData}
        isCampaignLive // campaign!
        showError={mockShowError}
      />
    )
    expect(wrapper.find('[data-test-id="widget-clock"]').length).toBe(0)
  })

  it('contains an ID for the new user tour (to showcase widgets)', () => {
    const WidgetsComponent = require('js/components/Widget/WidgetsComponent')
      .default
    const wrapper = shallow(
      <WidgetsComponent user={mockUserData} showError={mockShowError} />
    )

    // Important: other code relies on the data-tour-id to show the
    // new user tour. Do not change it without updating it elsewhere.
    expect(wrapper.find('[data-tour-id="widgets"]').length).toBe(1)
  })
})
