/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

describe('SearchApp', () => {
  it('renders without error', () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    shallow(<SearchApp />)
  })

  it('does not contain the legacy MUI theme provider', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    expect(wrapper.find(V0MuiThemeProvider).exists()).toBe(false)
  })

  it('contains the MUI theme provider', async () => {
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<SearchApp />)
    expect(wrapper.find(MuiThemeProvider).exists()).toBe(true)
  })
})
