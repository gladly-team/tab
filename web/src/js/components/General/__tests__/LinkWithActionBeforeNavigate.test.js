/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { goTo } from 'js/navigation/navigation'

jest.mock('js/navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

describe('LinkWithActionBeforeNavigate', () => {
  it('renders without error', () => {
    const LinkWithActionBeforeNavigate = require('js/components/General/LinkWithActionBeforeNavigate')
      .default
    shallow(
      <LinkWithActionBeforeNavigate
        to={'https://example.com/foo/'}
        beforeNavigate={() => {}}
      />
    )
  })

  it('navigates to the value of the "to" prop on click', async () => {
    expect.assertions(3)
    const LinkWithActionBeforeNavigate = require('js/components/General/LinkWithActionBeforeNavigate')
      .default
    const mockBeforeNav = jest.fn()
    const wrapper = shallow(
      <LinkWithActionBeforeNavigate
        to={'https://example.com/foo/'}
        beforeNavigate={mockBeforeNav}
      />
    )
    expect(goTo).not.toHaveBeenCalled()
    await wrapper
      .find('a')
      .first()
      .prop('onClick')()
    expect(goTo).toHaveBeenCalledWith('https://example.com/foo/')
    expect(goTo).toHaveBeenCalledTimes(1)
  })

  it('calls a sync "beforeNavigate" function on click', () => {
    const LinkWithActionBeforeNavigate = require('js/components/General/LinkWithActionBeforeNavigate')
      .default
    const mockBeforeNav = jest.fn()
    const wrapper = shallow(
      <LinkWithActionBeforeNavigate
        to={'https://example.com/foo/'}
        beforeNavigate={mockBeforeNav}
      />
    )
    expect(mockBeforeNav).not.toHaveBeenCalled()
    wrapper
      .find('a')
      .first()
      .simulate('click')
    expect(mockBeforeNav).toHaveBeenCalledTimes(1)
  })
})
