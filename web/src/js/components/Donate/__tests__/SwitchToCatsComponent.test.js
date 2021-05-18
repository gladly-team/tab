/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import catImage from 'js/assets/catCharity.png'
import SetV4BetaMutation from 'js/mutations/SetV4BetaMutation'
import optIntoV4Beta from 'js/utils/v4-beta-opt-in'
import Button from '@material-ui/core/Button'
import { flushAllPromises } from 'js/utils/test-utils'
import { reloadDashboard } from 'js/navigation/navigation'

jest.mock('js/utils/v4-beta-opt-in')
jest.mock('js/mutations/SetV4BetaMutation')
jest.mock('js/navigation/navigation', () => ({ reloadDashboard: jest.fn() }))
const getMockProps = () => ({
  user: {
    id: 'abc123',
    vcCurrent: 23,
  },
})

describe('Charity (donate Hearts) component', () => {
  it('renders without error', () => {
    const Charity = require('js/components/Donate/SwitchToCatsComponent')
      .default
    const mockProps = getMockProps()
    shallow(<Charity {...mockProps} />)
  })

  it('contains the charity image', () => {
    const Charity = require('js/components/Donate/SwitchToCatsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<Charity {...mockProps} />)
    expect(
      wrapper
        .find('img')
        .first()
        .prop('src')
    ).toBe(catImage)
  })

  it('opts user into v4 on click', async () => {
    const Charity = require('js/components/Donate/SwitchToCatsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<Charity {...mockProps} />)
    const switchButton = wrapper.find(Button).first()
    switchButton.simulate('click')
    await flushAllPromises()
    expect(SetV4BetaMutation).toHaveBeenCalled()
    expect(optIntoV4Beta).toHaveBeenCalled()
    expect(reloadDashboard).toHaveBeenCalled()
  })
})
