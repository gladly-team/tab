/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
jest.mock('js/navigation/navigation')

const getMockProps = () => ({
  app: {
    moneyRaised: 650200,
    dollarsPerDayRate: 450,
  },
})

describe('MoneyRaisedComponent', () => {
  it('renders without error', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    shallow(<MoneyRaisedComponent {...mockProps} />).dive()
  })
})
