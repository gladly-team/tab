/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { goTo } from 'js/navigation/navigation'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('js/navigation/navigation')

const getMockClickEvent = () => ({
  preventDefault: jest.fn(),
})

afterEach(() => {
  jest.clearAllMocks()
  jest.useRealTimers()
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

  it('sets the href value but calls event.preventDefault on click', async () => {
    expect.assertions(2)
    const LinkWithActionBeforeNavigate = require('js/components/General/LinkWithActionBeforeNavigate')
      .default
    const mockBeforeNav = jest.fn()
    const wrapper = shallow(
      <LinkWithActionBeforeNavigate
        to={'https://example.com/blah/'}
        beforeNavigate={mockBeforeNav}
      />
    )
    expect(
      wrapper
        .find('a')
        .first()
        .prop('href')
    ).toEqual('https://example.com/blah/')
    const event = getMockClickEvent()
    await wrapper
      .find('a')
      .first()
      .prop('onClick')(event)
    expect(event.preventDefault).toHaveBeenCalled()
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
      .prop('onClick')(getMockClickEvent())
    expect(goTo).toHaveBeenCalledWith('https://example.com/foo/')
    expect(goTo).toHaveBeenCalledTimes(1)
  })

  it('still navigates to the value of the "to" prop even if "beforeNavigate" is not defined', async () => {
    expect.assertions(1)
    const LinkWithActionBeforeNavigate = require('js/components/General/LinkWithActionBeforeNavigate')
      .default
    const wrapper = shallow(
      <LinkWithActionBeforeNavigate
        to={'https://example.com/foo/'}
        beforeNavigate={undefined}
      />
    )
    await wrapper
      .find('a')
      .first()
      .prop('onClick')(getMockClickEvent())
    expect(goTo).toHaveBeenCalledWith('https://example.com/foo/')
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
      .simulate('click', getMockClickEvent())
    expect(mockBeforeNav).toHaveBeenCalledTimes(1)
  })

  it('completes an async "beforeNavigate" function before navigating', async () => {
    expect.assertions(4)
    const LinkWithActionBeforeNavigate = require('js/components/General/LinkWithActionBeforeNavigate')
      .default

    jest.useFakeTimers()
    const mockEvent = jest.fn()
    const mockBeforeNav = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            mockEvent()
          }, 10e2)
          setTimeout(() => {
            resolve()
          }, 10e4)
        })
    )
    const wrapper = shallow(
      <LinkWithActionBeforeNavigate
        to={'https://example.com/foo/'}
        beforeNavigate={mockBeforeNav}
      />
    )
    wrapper
      .find('a')
      .first()
      .prop('onClick')(getMockClickEvent())
    expect(mockBeforeNav).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(10e3)
    expect(mockEvent).toHaveBeenCalledTimes(1)
    await flushAllPromises()
    expect(goTo).not.toHaveBeenCalled()
    jest.advanceTimersByTime(10e5)
    await flushAllPromises()
    expect(goTo).toHaveBeenCalledWith('https://example.com/foo/')
  })
})
