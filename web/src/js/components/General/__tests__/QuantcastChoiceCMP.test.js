/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { Helmet } from 'react-helmet'

jest.mock('react-helmet')

const getMockProps = () => ({})

afterEach(() => {
  delete window.__cmp
})

describe('QuantcastChoiceCMP component', () => {
  it('renders without error', () => {
    const QuantcastChoiceCMP = require('js/components/General/QuantcastChoiceCMP')
      .default
    const mockProps = getMockProps()
    shallow(<QuantcastChoiceCMP {...mockProps} />)
  })

  it('adds the Quantcast CMP JS script to the head of the document', () => {
    const QuantcastChoiceCMP = require('js/components/General/QuantcastChoiceCMP')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<QuantcastChoiceCMP {...mockProps} />)
    const script = wrapper.find(Helmet).find('script')
    expect(script.prop('src')).toBe('https://quantcast.mgr.consensu.org/cmp.js')
  })

  it('adds the inline style to the head of the document', () => {
    const QuantcastChoiceCMP = require('js/components/General/QuantcastChoiceCMP')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<QuantcastChoiceCMP {...mockProps} />)
    const style = wrapper.find(Helmet).find('style')
    expect(style.text().indexOf('.qc-cmp-button:hover')).not.toEqual(-1)
  })

  it('sets the window.__cmp function on mount', () => {
    const QuantcastChoiceCMP = require('js/components/General/QuantcastChoiceCMP')
      .default
    expect(window.__cmp).toBeUndefined()
    const mockProps = getMockProps()
    shallow(<QuantcastChoiceCMP {...mockProps} />)
    expect(typeof window.__cmp).toEqual('function')
  })

  it('initializes the CMP on mount', () => {
    const QuantcastChoiceCMP = require('js/components/General/QuantcastChoiceCMP')
      .default
    window.__cmp = jest.fn()
    const mockProps = getMockProps()
    shallow(<QuantcastChoiceCMP {...mockProps} />)
    expect(window.__cmp).toHaveBeenCalledTimes(1)
    expect(window.__cmp.mock.calls[0][0]).toEqual('init')
    expect(window.__cmp.mock.calls[0][1]).toMatchObject({
      'Publisher Name': 'Tab for a Cause',
      'Display UI': 'inEU',
    })
  })
})
