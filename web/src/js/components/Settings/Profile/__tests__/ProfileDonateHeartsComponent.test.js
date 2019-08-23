/* eslint-env jest */

import React from 'react'
import { Helmet } from 'react-helmet'
import { shallow } from 'enzyme'
import Charity from 'js/components/Donate/CharityContainer'

const getMockProps = () => ({
  app: {
    charities: {
      edges: [
        {
          node: {
            // Other attributes here are passed to child components.
            id: 'some-id',
          },
        },
        {
          node: {
            id: 'some-other-id',
          },
        },
      ],
    },
  },
  user: {
    // Attributes here are passed to child components.
  },
  showError: jest.fn(),
})

describe('ProfileDonateHearts component', () => {
  it('renders without error', () => {
    const ProfileDonateHearts = require('js/components/Settings/Profile/ProfileDonateHeartsComponent')
      .default
    const mockProps = getMockProps()
    shallow(<ProfileDonateHearts {...mockProps} />).dive()
  })

  it('sets the the page title', async () => {
    const ProfileDonateHearts = require('js/components/Settings/Profile/ProfileDonateHeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileDonateHearts {...mockProps} />).dive()
    expect(
      wrapper
        .find(Helmet)
        .find('title')
        .first()
        .text()
    ).toEqual('Donate Hearts')
  })

  it('renders the Charity components', () => {
    const ProfileDonateHearts = require('js/components/Settings/Profile/ProfileDonateHeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileDonateHearts {...mockProps} />).dive()

    const charity1 = wrapper.find(Charity).first()
    expect(charity1.prop('charity')).toEqual(
      mockProps.app.charities.edges[0].node
    )
    const charity2 = wrapper.find(Charity).at(1)
    expect(charity2.prop('charity')).toEqual(
      mockProps.app.charities.edges[1].node
    )
  })
})
