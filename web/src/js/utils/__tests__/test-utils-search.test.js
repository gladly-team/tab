/* eslint-env jest */

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('getMockUniqueURL', () => {
  it('returns URLs with incrementing numbers', () => {
    const { getMockUniqueURL } = require('js/utils/test-utils-search')
    expect(getMockUniqueURL()).toEqual('https://example.com/some-url-1')
    expect(getMockUniqueURL()).toEqual('https://example.com/some-url-2')
    expect(getMockUniqueURL()).toEqual('https://example.com/some-url-3')
  })
})

describe('getMockUniqueID', () => {
  it('returns IDs with incrementing numbers', () => {
    const { getMockUniqueID } = require('js/utils/test-utils-search')
    expect(getMockUniqueID()).toEqual(
      'https://api.cognitive.microsoft.com/api/v7/some-fake-id-1'
    )
    expect(getMockUniqueID()).toEqual(
      'https://api.cognitive.microsoft.com/api/v7/some-fake-id-2'
    )
    expect(getMockUniqueID()).toEqual(
      'https://api.cognitive.microsoft.com/api/v7/some-fake-id-3'
    )
  })
})

describe('getMockBingWebPageDeepLinkObject', () => {
  it('includes the expected keys', () => {
    const {
      getMockBingWebPageDeepLinkObject,
    } = require('js/utils/test-utils-search')
    expect(Object.keys(getMockBingWebPageDeepLinkObject()).sort()).toEqual([
      'name',
      'snippet',
      'url',
      'urlPingSuffix',
    ])
  })

  it('allows overriding values', () => {
    const {
      getMockBingWebPageDeepLinkObject,
    } = require('js/utils/test-utils-search')
    const defaultData = getMockBingWebPageDeepLinkObject()
    expect(defaultData).toMatchObject({
      name: 'This site is related',
      snippet: 'This is a snippet related to the site.',
    })
    expect(
      getMockBingWebPageDeepLinkObject({
        name: 'A really nice link',
      })
    ).toMatchObject({
      name: 'A really nice link',
      snippet: 'This is a snippet related to the site.',
    })
  })
})

describe('getMockBingNewsArticleResult', () => {
  it('includes the expected keys', () => {
    const {
      getMockBingNewsArticleResult,
    } = require('js/utils/test-utils-search')
    expect(Object.keys(getMockBingNewsArticleResult()).sort()).toEqual([
      'category',
      'clusteredArticles',
      'contractualRules',
      'datePublished',
      'description',
      'headline',
      'id',
      'image',
      'mentions',
      'name',
      'provider',
      'url',
      'video',
    ])
  })

  it('generates unique IDs for each mock news article', () => {
    const {
      getMockBingNewsArticleResult,
    } = require('js/utils/test-utils-search')
    expect(getMockBingNewsArticleResult().id).not.toEqual(
      getMockBingNewsArticleResult().id
    )
  })

  it('generates unique URLs for each mock news article', () => {
    const {
      getMockBingNewsArticleResult,
    } = require('js/utils/test-utils-search')
    expect(getMockBingNewsArticleResult().url).not.toEqual(
      getMockBingNewsArticleResult().url
    )
  })

  it('allows overriding values', () => {
    const {
      getMockBingNewsArticleResult,
    } = require('js/utils/test-utils-search')
    const defaultData = getMockBingNewsArticleResult()
    expect(defaultData).toMatchObject({
      datePublished: '2018-12-24T15:23:39',
    })
    expect(
      getMockBingNewsArticleResult({
        url: 'https://another-example.com/other-news/',
        name: 'Now this is what I call clickbait!',
      })
    ).toMatchObject({
      datePublished: '2018-12-24T15:23:39', // did not change
      url: 'https://another-example.com/other-news/',
      name: 'Now this is what I call clickbait!',
    })
  })
})

describe('getMockBingWebPageResult', () => {
  it('includes the expected keys', () => {
    const { getMockBingWebPageResult } = require('js/utils/test-utils-search')
    expect(Object.keys(getMockBingWebPageResult()).sort()).toEqual([
      'dateLastCrawled',
      'deepLinks',
      'displayUrl',
      'id',
      'name',
      'searchTags',
      'snippet',
      'url',
    ])
  })

  it('generates unique IDs for each mock webpage', () => {
    const { getMockBingWebPageResult } = require('js/utils/test-utils-search')
    expect(getMockBingWebPageResult().id).not.toEqual(
      getMockBingWebPageResult().id
    )
  })

  it('generates unique URLs for each mock webpage', () => {
    const { getMockBingWebPageResult } = require('js/utils/test-utils-search')
    expect(getMockBingWebPageResult().url).not.toEqual(
      getMockBingWebPageResult().url
    )
  })

  it('allows overriding values', () => {
    const { getMockBingWebPageResult } = require('js/utils/test-utils-search')
    const defaultData = getMockBingWebPageResult()
    expect(defaultData).toMatchObject({
      dateLastCrawled: '2018-12-24T15:23:39',
      displayUrl: 'https://example.com',
      name: 'A <b>Really Awesome</b> Webpage',
    })
    expect(
      getMockBingWebPageResult({
        dateLastCrawled: '2020-11-03T20:01:21',
        displayUrl: 'https://another-example.com',
      })
    ).toMatchObject({
      dateLastCrawled: '2020-11-03T20:01:21',
      displayUrl: 'https://another-example.com',
      name: 'A <b>Really Awesome</b> Webpage',
    })
  })
})

describe('getMockBingComputationResult', () => {
  it('includes the expected keys', () => {
    const {
      getMockBingComputationResult,
    } = require('js/utils/test-utils-search')
    expect(Object.keys(getMockBingComputationResult()).sort()).toEqual([
      'expression',
      'id',
      'value',
    ])
  })

  it('allows overriding values', () => {
    const {
      getMockBingComputationResult,
    } = require('js/utils/test-utils-search')
    const defaultData = getMockBingComputationResult()
    expect(defaultData).toMatchObject({
      id: 'https://www.bing.com/api/v7/#Computation',
    })
    expect(
      getMockBingComputationResult({
        id: 'foo',
      })
    ).toMatchObject({
      id: 'foo',
    })
  })
})

describe('getMockBingTimeZoneResult', () => {
  it('includes the expected keys', () => {
    const { getMockBingTimeZoneResult } = require('js/utils/test-utils-search')
    expect(Object.keys(getMockBingTimeZoneResult()).sort()).toEqual([
      'id',
      'otherCityTimes',
      'primaryCityTime',
    ])
  })

  it('includes the expected keys in primaryCityTime', () => {
    const { getMockBingTimeZoneResult } = require('js/utils/test-utils-search')
    expect(
      Object.keys(getMockBingTimeZoneResult().primaryCityTime).sort()
    ).toEqual(['location', 'time', 'utcOffset'])
  })

  it('allows overriding values', () => {
    const { getMockBingTimeZoneResult } = require('js/utils/test-utils-search')
    const defaultData = getMockBingTimeZoneResult()
    expect(defaultData).toMatchObject({
      id: 'https://www.bing.com/api/v7/#TimeZone',
    })
    expect(
      getMockBingTimeZoneResult({
        id: 'foo',
      })
    ).toMatchObject({
      id: 'foo',
    })
  })
})

describe('getMockSuccessfulSearchQuery', () => {
  it('includes the expected keys', () => {
    const {
      getMockSuccessfulSearchQuery,
    } = require('js/utils/test-utils-search')
    expect(Object.keys(getMockSuccessfulSearchQuery()).sort()).toEqual([
      'bing',
      'bingExtras',
    ])
  })

  it('includes the expected keys in the "bing" property value', () => {
    const {
      getMockSuccessfulSearchQuery,
    } = require('js/utils/test-utils-search')
    expect(Object.keys(getMockSuccessfulSearchQuery().bing).sort()).toEqual([
      '_type',
      'ads',
      'computation',
      'instrumentation',
      'news',
      'queryContext',
      'rankingResponse',
      'webPages',
    ])
  })
})

describe('getMockErrorSearchQuery', () => {
  it('includes the expected keys', () => {
    const { getMockErrorSearchQuery } = require('js/utils/test-utils-search')
    expect(Object.keys(getMockErrorSearchQuery()).sort()).toEqual([
      'bing',
      'bingExtras',
    ])
  })

  it('includes the expected keys in the "bing" property value', () => {
    const { getMockErrorSearchQuery } = require('js/utils/test-utils-search')
    expect(Object.keys(getMockErrorSearchQuery().bing).sort()).toEqual([
      '_type',
      'errors',
    ])
  })

  it('includes error items in the errors array', () => {
    const { getMockErrorSearchQuery } = require('js/utils/test-utils-search')
    expect(getMockErrorSearchQuery().bing.errors.length).toBeGreaterThan(0)
  })
})
