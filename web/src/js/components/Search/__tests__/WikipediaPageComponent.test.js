/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  description: 'Usually savory dish of flattened bread and toppings',
  extract: `<p class="mw-empty-elt">\n</p>\n\n<p><b>Pizza</b> (<small>Italian: </small>[ˈpittsa], <small>Neapolitan: </small>[ˈpittsə]) is a savory dish of Italian origin, consisting of a usually round, flattened base of leavened wheat-based dough topped with tomatoes, cheese, and various other ingredients (anchovies, olives, meat, etc.) baked at a high temperature, traditionally in a wood-fired oven.</p>`,
  pageURL: 'https://en.wikipedia.org/wiki/Pizza',
  thumbnailURL:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/200px-Eq_it-na_pizza-margherita_sep2005_sml.jpg',
  title: 'Pizza',
})

describe('WikipediaPageComponent', () => {
  it('renders without error', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    shallow(<WikipediaPageComponent {...mockProps} />).dive()
  })

  it('displays the title', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.title = 'George Washington'
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-wiki-title"]')
        .render()
        .text()
    ).toEqual('George Washington')
  })

  it('renders the thumbnail image', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.thumbnailURL = 'https://example.com/img/foo.png'
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    expect(
      wrapper.find('[data-test-id="search-wiki-thumbnail"]').prop('src')
    ).toEqual('https://example.com/img/foo.png')
  })

  it('sets the expected style on the thumbnail image parent', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.thumbnailURL = 'https://example.com/img/foo.png'
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    const imgParent = wrapper
      .find('[data-test-id="search-wiki-thumbnail"]')
      .parent()
    expect(imgParent.prop('style')).toMatchObject({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 200,
      height: 150,
      overflow: 'hidden',
    })
  })

  it('does not render the thumbnail image if there is no provided image', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.thumbnailURL = null
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    expect(
      wrapper.find('[data-test-id="search-wiki-thumbnail"]').exists()
    ).toBe(false)
  })

  it('renders the description', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-wiki-desc"]')
        .render()
        .text()
    ).toEqual('Usually savory dish of flattened bread and toppings')
  })

  it('does not render the description if it is not provided', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    delete mockProps.description
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="search-wiki-desc"]').exists()).toBe(
      false
    )
  })

  it('renders the extract HTML', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    const extractParent = wrapper
      .find('[data-test-id="search-wiki-extract"]')
      .render()
    expect(
      extractParent
        .find('b')
        .first()
        .text()
    ).toEqual('Pizza')
    expect(extractParent.text()).toEqual(
      expect.stringContaining(
        'baked at a high temperature, traditionally in a wood-fired oven'
      )
    )
  })

  it('links to the Wikipedia page in the "read more" link', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    const readMoreElem = wrapper.find('[data-test-id="search-wiki-read-more"]')
    expect(readMoreElem.render().text()).toEqual('Read more')
    expect(
      readMoreElem
        .find('a')
        .first()
        .prop('href')
    ).toEqual('https://en.wikipedia.org/wiki/Pizza')
  })

  it('links to the Wikipedia page in the "Wikipedia" attribution', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    const attribText = wrapper.find('[data-test-id="search-wiki-attrib"]')
    expect(attribText.render().text()).toEqual('From Wikipedia')
    const attribLink = attribText.find('a').first()
    expect(attribLink.prop('href')).toEqual(
      'https://en.wikipedia.org/wiki/Pizza'
    )
  })

  it('links to the license', () => {
    const WikipediaPageComponent = require('js/components/Search/WikipediaPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<WikipediaPageComponent {...mockProps} />).dive()
    const licenseText = wrapper.find('[data-test-id="search-wiki-license"]')
    expect(licenseText.render().text()).toEqual('Content under CC BY-SA')
    expect(
      licenseText
        .find('a')
        .first()
        .prop('href')
    ).toEqual('https://creativecommons.org/licenses/by-sa/3.0/')
  })
})
