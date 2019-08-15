/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Charity from 'js/components/Donate/CharityContainer'

const getMockProps = () => ({
  app: {
    charities: {
      edges: [
        {
          node: {
            id: 'some-charity-id',
            image:
              'http://static.example.com/img/charities/charity-post-donation-images/some-charity.jpg',
            impact: 'Your donation helps do something in particular.',
            name: 'Some Charity',
            website: 'https://www.example.com/something/',
          },
        },
        {
          node: {
            id: 'another-charity-id',
            image:
              'http://static.example.com/img/charities/charity-post-donation-images/another-charity.jpg',
            impact: 'Your donation helps do another thing.',
            name: 'Some Charity',
            website: 'https://www.example.com/another-thing/',
          },
        },
      ],
    },
  },
  user: {
    // No attributes available to the the top component. They're passed
    // to child components.
  },
  showError: jest.fn(),
})

describe('ProfileDonateHearts component', () => {
  it('renders without error', () => {
    const ProfileDonateHearts = require('js/components/Settings/Profile/ProfileDonateHeartsComponent')
      .default
    const mockProps = getMockProps()
    shallow(<ProfileDonateHearts {...mockProps} />)
  })

  it('renders the Charity components', () => {
    const ProfileDonateHearts = require('js/components/Settings/Profile/ProfileDonateHeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileDonateHearts {...mockProps} />)

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
