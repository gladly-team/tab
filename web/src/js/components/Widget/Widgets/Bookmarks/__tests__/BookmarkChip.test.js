/* eslint-env jest */

import React from 'react'
import { shallow, mount } from 'enzyme'
import Link from 'js/components/General/Link'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const getMockPropsBookmarkChip = () => ({
  bookmark: { name: 'example', link: 'example.com' },
  index: 0,
  editMode: false,
  editBookmark: jest.fn(),
  deleteBookmark: jest.fn(),
  onReorderMoveUp: jest.fn(),
  onReorderMoveDown: jest.fn(),
})

describe('BookmarkChip', () => {
  it('renders without error', () => {
    const BookmarkChip = require('../BookmarkChip').default
    const mockProps = getMockPropsBookmarkChip()
    shallow(<BookmarkChip {...mockProps} />)
  })

  it('mounts without error', () => {
    const BookmarkChip = require('../BookmarkChip').default
    const mockProps = getMockPropsBookmarkChip()
    mount(
      <MuiThemeProvider>
        <BookmarkChip {...mockProps} />
      </MuiThemeProvider>
    )
  })

  it('renders a Link element when edit mode is false', () => {
    const BookmarkChip = require('../BookmarkChip').default
    const mockProps = getMockPropsBookmarkChip()
    const wrapper = mount(
      <MuiThemeProvider>
        <BookmarkChip {...mockProps} />
      </MuiThemeProvider>
    )
    expect(wrapper.find(Link)).toHaveLength(1)
  })

  it('renders a Link element when edit mode is false with the "to" prop having full url with protocol', () => {
    const BookmarkChip = require('../BookmarkChip').default
    const mockProps = getMockPropsBookmarkChip()
    const wrapper = mount(
      <MuiThemeProvider>
        <BookmarkChip {...mockProps} />
      </MuiThemeProvider>
    )
    expect(wrapper.find(Link).prop('to')).toBe('http://example.com')
  })

  it('does not render a Link element when edit mode is true', () => {
    const BookmarkChip = require('../BookmarkChip').default
    const mockProps = getMockPropsBookmarkChip()
    const wrapper = mount(
      <MuiThemeProvider>
        <BookmarkChip {...mockProps} editMode={true} />
      </MuiThemeProvider>
    )
    expect(wrapper.find(Link)).toHaveLength(0)
  })
})
