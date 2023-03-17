/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { goTo } from 'js/navigation/navigation'
import { STORAGE_REDIRECT_URI } from 'js/constants'

jest.mock('js/navigation/navigation')

// Workaround to not have to .dive() on all shallow renders.
jest.mock('@material-ui/core/styles', () => {
  const muiStyles = require.requireActual('@material-ui/core/styles')
  return {
    ...muiStyles,
    withStyles: () => comp => comp,
  }
})

describe('Shop component', () => {
  it('redirect if user is logged and has a cause and no STORAGE_REDIRECT_URI', async () => {
    expect.assertions(2)
    const ShopComponent = require('js/components/Shop/ShopComponent').default
    const mockProps = {
      user: {
        id: 'abc123',
        causeId: 'HJGFRNBN',
      },
      style: {},
    }
    const wrapper = await shallow(<ShopComponent {...mockProps} />)
    expect(goTo).toHaveBeenCalledWith('/newtab')
    expect(wrapper).toBe(null)
  })

  it('redirect if user is logged and has a cause and has STORAGE_REDIRECT_URI', async () => {
    expect.assertions(2)

    const localStorageMock = (() => {
      let store = {}
      return {
        getItem: key => store[key],
        setItem: (key, value) => (store[key] = value.toString()),
        clear: () => (store = {}),
      }
    })()

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })

    window.localStorage.setItem(STORAGE_REDIRECT_URI, 'http://www.google.com')

    const ShopComponent = require('js/components/Shop/ShopComponent').default
    const mockProps = {
      user: {
        userId: 'abc123',
        causeId: 'HJGFRNBN',
      },
      style: {},
    }
    const wrapper = await shallow(<ShopComponent {...mockProps} />)
    expect(goTo).toHaveBeenCalledWith('http://www.google.com?uuid=abc123')
    expect(wrapper).toBe(null)
  })
})
