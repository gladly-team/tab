/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import catImage from 'js/assets/catCharity.png'
import SetV4BetaMutation from 'js/mutations/SetV4BetaMutation'
import optIntoV4Beta from 'js/utils/v4-beta-opt-in'
import Button from '@material-ui/core/Button'
import { flushAllPromises } from 'js/utils/test-utils'
import { reloadDashboard } from 'js/navigation/navigation'
import SetBackgroundDailyImageMutation from 'js/mutations/SetBackgroundDailyImageMutation'
jest.mock('js/utils/v4-beta-opt-in')
jest.mock('js/mutations/SetV4BetaMutation')
jest.mock('js/navigation/navigation', () => ({ reloadDashboard: jest.fn() }))
jest.mock('js/mutations/SetBackgroundDailyImageMutation')
const getMockProps = () => ({
  user: {
    id: 'abc123',
  },
  relay: { environment: {} },
})

describe('Switch to V4 component', () => {
  it('renders without error', () => {
    const Comp = require('js/components/Donate/SwitchToCatsComponent').default
    const mockProps = getMockProps()
    shallow(<Comp {...mockProps} />)
  })

  it('contains the cat image', () => {
    const Comp = require('js/components/Donate/SwitchToCatsComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Comp {...mockProps} />)
    expect(
      wrapper
        .find('img')
        .first()
        .prop('src')
    ).toBe(catImage)
  })

  it('opts user into v4 on click', async () => {
    const Comp = require('js/components/Donate/SwitchToCatsComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Comp {...mockProps} />)
    const switchButton = wrapper.find(Button).first()
    switchButton.simulate('click')
    await flushAllPromises()
    expect(SetV4BetaMutation).toHaveBeenCalled()
    expect(optIntoV4Beta).toHaveBeenCalled()
    expect(reloadDashboard).toHaveBeenCalled()
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalledWith(
      expect.any(Object),
      'abc123',
      expect.any(Function),
      expect.any(Function),
      'cats'
    )
  })
})
