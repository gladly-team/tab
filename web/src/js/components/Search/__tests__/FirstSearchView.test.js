/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { replaceUrl } from 'js/navigation/navigation'
import { detectSupportedBrowser } from 'js/utils/detectBrowser'

jest.mock('js/utils/detectBrowser')
jest.mock('js/navigation/navigation')

const getMockProps = () => ({})

beforeEach(() => {
  detectSupportedBrowser.mockReturnValue('chrome')
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('FirstSearchView', function() {
  it('renders without error', () => {
    const FirstSearchView = require('js/components/Search/FirstSearchView')
      .default
    shallow(<FirstSearchView {...getMockProps()} />)
  })

  it('returns no HTML', () => {
    const FirstSearchView = require('js/components/Search/FirstSearchView')
      .default
    const wrapper = shallow(<FirstSearchView {...getMockProps()} />)
    expect(wrapper.html()).toBeNull()
  })

  it('redirects to the main search page on mount', () => {
    const FirstSearchView = require('js/components/Search/FirstSearchView')
      .default
    shallow(<FirstSearchView {...getMockProps()} />)
    expect(replaceUrl).toHaveBeenCalledWith('/search', expect.any(Object))
  })

  it('sets the search query ("q" URL param) the expected first query for new users', () => {
    const FirstSearchView = require('js/components/Search/FirstSearchView')
      .default
    detectSupportedBrowser.mockReturnValue('chrome')
    shallow(<FirstSearchView {...getMockProps()} />)
    expect(replaceUrl.mock.calls[0][1]).toMatchObject({
      q: 'How many searches do people make every day?',
    })
  })

  it('sets the "src" URL param to "chrome" when the browser is Chrome', () => {
    const FirstSearchView = require('js/components/Search/FirstSearchView')
      .default
    detectSupportedBrowser.mockReturnValue('chrome')
    shallow(<FirstSearchView {...getMockProps()} />)
    expect(replaceUrl.mock.calls[0][1]).toMatchObject({
      src: 'chrome',
    })
  })

  it('sets the "src" URL param to "ff" when the browser is Firefox', () => {
    const FirstSearchView = require('js/components/Search/FirstSearchView')
      .default
    detectSupportedBrowser.mockReturnValue('firefox')
    shallow(<FirstSearchView {...getMockProps()} />)
    expect(replaceUrl.mock.calls[0][1]).toMatchObject({
      src: 'ff',
    })
  })

  it('sets the "src" URL param to null when the browser is some unsupported browser', () => {
    const FirstSearchView = require('js/components/Search/FirstSearchView')
      .default
    detectSupportedBrowser.mockReturnValue('other')
    shallow(<FirstSearchView {...getMockProps()} />)
    expect(replaceUrl.mock.calls[0][1]).toMatchObject({
      src: null,
    })
  })
})
