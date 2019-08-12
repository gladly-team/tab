/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

jest.mock('js/authentication/firebaseConfig')
jest.mock('js/components/App/App', () => () => null)
jest.mock('js/components/Search/SearchApp', () => () => null)

afterEach(() => {
  jest.resetModules()
  delete process.env.REACT_APP_WHICH_APP
  jest.clearAllMocks()
})

describe('root.js: REACT_APP_WHICH_APP env var', () => {
  it('creates the expected route when app = "newtab"', () => {
    process.env.REACT_APP_WHICH_APP = 'newtab'
    const { Route } = require('react-router-dom')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    expect(
      wrapper
        .find(Route)
        .first()
        .prop('path')
    ).toEqual('/newtab/')
  })

  it('uses the expected component when app = "newtab"', () => {
    process.env.REACT_APP_WHICH_APP = 'newtab'
    const { Route } = require('react-router-dom')
    const Root = require('js/root').default
    const NewTabApp = require('js/components/App/App').default
    const wrapper = shallow(<Root />)
    expect(
      wrapper
        .find(Route)
        .first()
        .prop('component')
    ).toEqual(NewTabApp)
  })

  it('creates the expected route when app = "search"', () => {
    process.env.REACT_APP_WHICH_APP = 'search'
    const { Route } = require('react-router-dom')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    expect(
      wrapper
        .find(Route)
        .first()
        .prop('path')
    ).toEqual('/search/')
  })

  it('uses the expected component when app = "search"', () => {
    process.env.REACT_APP_WHICH_APP = 'search'
    const { Route } = require('react-router-dom')
    const Root = require('js/root').default
    const SearchApp = require('js/components/Search/SearchApp').default
    const wrapper = shallow(<Root />)
    expect(
      wrapper
        .find(Route)
        .first()
        .prop('component')
    ).toEqual(SearchApp)
  })

  it('throws an error when REACT_APP_WHICH_APP is not set to a valid value', () => {
    process.env.REACT_APP_WHICH_APP = 'blah'
    expect(() => {
      const Root = require('js/root').default
      shallow(<Root />)
    }).toThrow(
      'Env var "REACT_APP_WHICH_APP" should be set to "newtab" or "search". Received: "blah"'
    )
  })
})

// This is a very small subset of the link attributes/methods.
const getMockLinkTag = () => ({
  childNodes: [],
  children: [],
  className: '',
  dataset: {
    reactHelmet: 'true',
  },
  href: '/my-link/href/image.png',
  id: '',
  parentNode: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
  rel: 'icon',
  sizes: {
    value: '',
  },
})

const getMockReactHelmetAddedTags = () => ({
  linkTags: [getMockLinkTag()],
  scriptTags: undefined,
  styleTags: undefined,
})

describe('root.js: react-helmet favicon bug workaround', () => {
  beforeEach(() => {
    process.env.REACT_APP_WHICH_APP = 'newtab'

    // Reset mocks.
    jest.spyOn(document, 'querySelectorAll').mockImplementation(() => [])
    jest.spyOn(document, 'querySelector').mockImplementation(() => null)
  })

  it('renders a react-helmet Helmet element', () => {
    const { Helmet } = require('react-helmet')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    const helmetElem = wrapper.find(Helmet)
    expect(helmetElem.exists()).toBe(true)
  })

  it('does not call document.querySelector or document.querySelectorAll when no links were added', () => {
    const { Helmet } = require('react-helmet')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    const helmetElem = wrapper.find(Helmet)

    const mockQuerySelector = jest
      .spyOn(document, 'querySelector')
      .mockImplementation(() => null)
    const mockQuerySelectorAll = jest
      .spyOn(document, 'querySelectorAll')
      .mockImplementation(() => [])

    // Fake a react-helmet change to client state.
    const addedTags = getMockReactHelmetAddedTags()
    addedTags.linkTags = undefined // no link tags have changed
    helmetElem.prop('onChangeClientState')({}, addedTags)

    // Nothing should happen.
    expect(mockQuerySelector).not.toHaveBeenCalled()
    expect(mockQuerySelectorAll).not.toHaveBeenCalled()
  })

  it('does not call document.querySelector or document.querySelectorAll when the added links have a "rel" value other than "icon"', () => {
    const { Helmet } = require('react-helmet')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    const helmetElem = wrapper.find(Helmet)

    const mockQuerySelector = jest
      .spyOn(document, 'querySelector')
      .mockImplementation(() => null)
    const mockQuerySelectorAll = jest
      .spyOn(document, 'querySelectorAll')
      .mockImplementation(() => [])

    const addedTags = getMockReactHelmetAddedTags()

    // The added link tag has a rel=stylesheet attribute value.
    addedTags.linkTags = [
      {
        ...getMockLinkTag(),
        rel: 'stylesheet',
      },
    ]
    helmetElem.prop('onChangeClientState')({}, addedTags)

    // Nothing should happen.
    expect(mockQuerySelector).not.toHaveBeenCalled()
    expect(mockQuerySelectorAll).not.toHaveBeenCalled()
  })

  it('removes all other react-helmet link[rel="icon"] elements when a new one is added', () => {
    const { Helmet } = require('react-helmet')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    const helmetElem = wrapper.find(Helmet)

    // Mock the document.querySelectorAll response to provide mock existing
    // link elements with different hrefs.
    const mockOtherLinkA = {
      ...getMockLinkTag(),
      href: '/this-is-another-href.ico',
    }
    const mockOtherLinkB = {
      ...getMockLinkTag(),
      href: '/some-stuff.png',
    }
    const mockQuerySelectorAll = jest.fn(() => [mockOtherLinkA, mockOtherLinkB])
    jest
      .spyOn(document, 'querySelectorAll')
      .mockImplementation(mockQuerySelectorAll)

    // Fake a react-helmet change to client state.
    helmetElem.prop('onChangeClientState')({}, getMockReactHelmetAddedTags())

    // We expect to get all react-helmet favicon links with different hrefs
    // than the href of our new link.
    expect(mockQuerySelectorAll).toHaveBeenCalledWith(
      'link[rel="icon"][data-react-helmet]:not([href="/my-link/href/image.png"])'
    )

    // We expect to remove the other links.
    expect(mockOtherLinkA.parentNode.removeChild).toHaveBeenCalled()
    expect(mockOtherLinkB.parentNode.removeChild).toHaveBeenCalled()
  })

  it('removes and recreates the new favicon icon', () => {
    const { Helmet } = require('react-helmet')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    const helmetElem = wrapper.find(Helmet)

    // Mock the document.querySelectorAll response to provide mock existing
    // link elements with different hrefs.
    const mockOtherLinkA = {
      ...getMockLinkTag(),
      href: '/this-is-another-href.ico',
    }
    const mockOtherLinkB = {
      ...getMockLinkTag(),
      href: '/some-stuff.png',
    }
    const mockQuerySelectorAll = jest.fn(() => [mockOtherLinkA, mockOtherLinkB])
    jest
      .spyOn(document, 'querySelectorAll')
      .mockImplementation(mockQuerySelectorAll)

    // Mock the added link tag.
    const addedLinkTag = getMockLinkTag()
    const mockQuerySelector = jest.fn(() => addedLinkTag)
    jest.spyOn(document, 'querySelector').mockImplementation(mockQuerySelector)
    const addedTags = {
      linkTags: [addedLinkTag],
    }

    helmetElem.prop('onChangeClientState')({}, addedTags)

    // We expect to get all react-helmet favicon links with different hrefs
    // than the href of our new link.
    expect(mockQuerySelector).toHaveBeenCalledWith(
      'link[rel="icon"][data-react-helmet][href="/my-link/href/image.png"]'
    )

    // We expect to remove and re-add the link.
    expect(addedLinkTag.parentNode.removeChild).toHaveBeenCalledTimes(1)
    expect(addedLinkTag.parentNode.appendChild).toHaveBeenCalledTimes(1)
  })

  it("does not remove and recreate the new favicon icon if there isn't an existing favicon icon", () => {
    const { Helmet } = require('react-helmet')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    const helmetElem = wrapper.find(Helmet)

    // Mock that there isn't an existing favicon icon, which eliminates
    // the need to remove and recreate the new link element.
    const mockQuerySelectorAll = jest.fn(() => [])
    jest
      .spyOn(document, 'querySelectorAll')
      .mockImplementation(mockQuerySelectorAll)

    // Mock the added link tag.
    const addedLinkTag = getMockLinkTag()
    const mockQuerySelector = jest.fn(() => addedLinkTag)
    jest.spyOn(document, 'querySelector').mockImplementation(mockQuerySelector)
    const addedTags = {
      linkTags: [addedLinkTag],
    }

    helmetElem.prop('onChangeClientState')({}, addedTags)

    // We expect to remove and re-add the link.
    expect(addedLinkTag.parentNode.removeChild).not.toHaveBeenCalled()
    expect(addedLinkTag.parentNode.appendChild).not.toHaveBeenCalled()
  })

  it('logs a console error when there is an error', () => {
    const { Helmet } = require('react-helmet')
    const Root = require('js/root').default
    const wrapper = shallow(<Root />)
    const helmetElem = wrapper.find(Helmet)

    const mockErr = new Error('This browser is not to spec!!1')
    const mockQuerySelectorAll = jest.fn(() => {
      throw mockErr
    })
    jest
      .spyOn(document, 'querySelectorAll')
      .mockImplementation(mockQuerySelectorAll)

    const mockConsoleErr = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleErr)

    helmetElem.prop('onChangeClientState')({}, getMockReactHelmetAddedTags())
    expect(mockConsoleErr).toHaveBeenCalledWith(mockErr)
  })
})
