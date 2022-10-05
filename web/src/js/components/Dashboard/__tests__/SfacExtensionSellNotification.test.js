/* eslint-env jest */

import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount, shallow } from 'enzyme'
import { Button } from '@material-ui/core'
import CreateSfacExtensionPromptResponseMutation from 'js/mutations/CreateSfacExtensionPromptResponseMutation'
import { getSearchExtensionPage, replaceUrl } from 'js/navigation/navigation'
import flushAllPromises from 'js/utils/test-utils'
import logger from 'js/utils/logger'
import Notification from 'js/components/Dashboard/NotificationV2'
import useDoesBrowserSupportSearchExtension from 'js/utils/hooks/useDoesBrowserSupportSearchExtension'
import useBrowserName from 'js/utils/hooks/useBrowserName'

jest.mock('js/navigation/navigation')
jest.mock('js/utils/logger')
jest.mock('js/mutations/CreateSfacExtensionPromptResponseMutation')
jest.mock('js/utils/hooks/useDoesBrowserSupportSearchExtension')
jest.mock('js/utils/hooks/useBrowserName')

beforeAll(() => {
  jest.useFakeTimers()

  useDoesBrowserSupportSearchExtension.mockReturnValue(true)
  useBrowserName.mockReturnValue('chrome')
})

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  userId: 'abcdefghijklmno',
  showSfacExtensionPrompt: true,
})

describe('SfacExtensionSellNotification component', () => {
  it('renders without error', () => {
    const SfacExtensionSellNotification = require('js/components/Dashboard/SfacExtensionSellNotification')
      .default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SfacExtensionSellNotification {...mockProps} />)
    }).not.toThrow()
  })

  it('calls mutation, calls handler and closes on clicking no', () => {
    const SfacExtensionSellNotification = require('js/components/Dashboard/SfacExtensionSellNotification')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    expect(
      wrapper
        .find(Notification)
        .first()
        .prop('open')
    ).toEqual(true)
    const acceptButton = wrapper.find(Button).at(0)
    expect(acceptButton.text()).toEqual('Maybe later')
    acceptButton.simulate('click')

    expect(CreateSfacExtensionPromptResponseMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'chrome',
      false
    )
    expect(
      wrapper
        .find(Notification)
        .first()
        .prop('open')
    ).toEqual(false)
  })

  it('calls mutation and redirect on clicking yes', async () => {
    expect.assertions(6)
    const SfacExtensionSellNotification = require('js/components/Dashboard/SfacExtensionSellNotification')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    expect(
      wrapper
        .find(Notification)
        .first()
        .prop('open')
    ).toEqual(true)
    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual("Let's do it!")

    CreateSfacExtensionPromptResponseMutation.mockResolvedValue({})

    await act(async () => {
      acceptButton.simulate('click')
    })

    wrapper.update()
    expect(CreateSfacExtensionPromptResponseMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'chrome',
      true
    )
    expect(
      wrapper
        .find(Notification)
        .first()
        .prop('open')
    ).toEqual(false)
    expect(replaceUrl).toHaveBeenCalledWith(getSearchExtensionPage)
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('calls a redirect to the search engine result page (and does not throw or log) if CreateSfacExtensionPromptResponseMutation throws an error', async () => {
    expect.assertions(6)
    const SfacExtensionSellNotification = require('js/components/Dashboard/SfacExtensionSellNotification')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    expect(
      wrapper
        .find(Notification)
        .first()
        .prop('open')
    ).toEqual(true)
    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual("Let's do it!")

    CreateSfacExtensionPromptResponseMutation.mockRejectedValue(
      new Error('Uh oh.')
    )

    await act(async () => {
      acceptButton.simulate('click')
    })

    wrapper.update()
    expect(CreateSfacExtensionPromptResponseMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'chrome',
      true
    )
    expect(
      wrapper
        .find(Notification)
        .first()
        .prop('open')
    ).toEqual(false)
    expect(replaceUrl).toHaveBeenCalledWith(getSearchExtensionPage)
    expect(logger.error).toHaveBeenCalledWith(new Error('Uh oh.'))
  })
})
