/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  charity: {
    id: 'some-charity-id',
    description:
      'A global humanitarian organization committed to ending world hunger',
    logo:
      'http://static.example.com/img/charities/charity-logos/acfusa-201804.png',
    name: 'Action Against Hunger',
    website: 'http://www.actionagainsthunger.org/',
  },
  user: {
    id: 'abc123',
    vcCurrent: 23,
  },
  showError: jest.fn(),
  style: {},
})

describe('Charity (donate Hearts) component', () => {
  it('renders without error', () => {
    const Charity = require('js/components/Donate/CharityComponent').default
    const mockProps = getMockProps()
    shallow(<Charity {...mockProps} />)
  })

  it('contains the charity image', () => {
    const Charity = require('js/components/Donate/CharityComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Charity {...mockProps} />)
    expect(
      wrapper
        .find('img')
        .first()
        .prop('src')
    ).toBe(mockProps.charity.logo)
  })
})
