/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import fetchWikipediaResults from 'js/components/Search/fetchWikipediaResults'
import WikipediaPage from 'js/components/Search/WikipediaPageComponent'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('js/components/Search/fetchWikipediaResults')
jest.mock('js/components/Search/WikipediaPageComponent')

const getMockWikipediaResponseData = overrides => ({
  batchcomplete: true,
  continue: {},
  query: {
    pages: [
      Object.assign(
        {},
        {
          canonicalurl: 'https://en.wikipedia.org/wiki/Grand_Canyon',
          contentmodel: 'wikitext',
          description:
            'A steep-sided canyon carved by the Colorado River in Arizona, United States',
          descriptionsource: 'local',
          editurl:
            'https://en.wikipedia.org/w/index.php?title=Grand_Canyon&action=edit',
          extract: `<p class="mw-empty-elt">↵</p>↵<p>The <b>Grand Canyon</b> (Hopi: <i>Ongtupqa</i>; Yavapai: <i lang="yuf">Wi:kaʼi:la</i>, Navajo: <i>Tsékooh Hatsoh</i>, Spanish: <i>Gran Cañón</i>) is a steep-sided canyon carved by the Colorado River in Arizona, United States.</p>`,
          fullurl: 'https://en.wikipedia.org/wiki/Grand_Canyon',
          index: 1,
          lastrevid: 890686385,
          length: 81692,
          ns: 0,
          pageid: 46989,
          pageimage: 'Grand_Canyon_view_from_Pima_Point_2010.jpg',
          pagelanguage: 'en',
          pagelanguagedir: 'ltr',
          pagelanguagehtmlcode: 'en',
          thumbnail: {
            source:
              'https://upload.wikimedia.org/wikipedia/commons/thu…/133px-Grand_Canyon_view_from_Pima_Point_2010.jpg',
            width: 133,
            height: 200,
          },
          title: 'Grand Canyon',
          touched: '2019-04-03T18:58:53Z',
        },
        overrides
      ),
    ],
  },
  warnings: {},
})

const getMockProps = () => ({
  query: 'grand canyon',
})

describe('WikipediaQuery', () => {
  it('passes the title to the WikipediaPageComponent', async () => {
    expect.assertions(1)
    fetchWikipediaResults.mockResolvedValue(getMockWikipediaResponseData())
    const WikipediaQuery = require('js/components/Search/WikipediaQuery')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<WikipediaQuery {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(WikipediaPage).prop('title')).toEqual('Grand Canyon')
  })
})
