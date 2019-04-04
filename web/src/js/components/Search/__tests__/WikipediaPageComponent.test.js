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
})
