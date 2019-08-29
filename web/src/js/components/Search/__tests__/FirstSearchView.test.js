/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { replaceUrl } from 'js/navigation/navigation'

jest.mock('js/navigation/navigation')

const getMockProps = () => ({})

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

  it('redirects to the dashboard on mount', () => {
    const FirstSearchView = require('js/components/Search/FirstSearchView')
      .default
    shallow(<FirstSearchView {...getMockProps()} />)
    expect(replaceUrl).toHaveBeenCalledWith('/search')
  })
})
