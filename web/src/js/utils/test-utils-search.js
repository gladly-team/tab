let urlID = 0
export const getMockUniqueURL = () => {
  urlID = urlID + 1
  return `https://example.com/some-url-${urlID}`
}

let mockIDNum = 0
export const getMockUniqueID = () => {
  mockIDNum = mockIDNum + 1
  return `https://api.cognitive.microsoft.com/api/v7/some-fake-id-${mockIDNum}`
}

// https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#webpage
export const getMockBingWebPageDeepLinkObject = overrides => {
  return Object.assign(
    {},
    {
      name: 'This site is related',
      url: getMockUniqueURL(),
      urlPingSuffix: 'something',
      snippet: 'This is a snippet related to the site.',
    },
    overrides
  )
}

// https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#webpage
export const getMockBingWebPageResult = overrides => {
  return Object.assign(
    {},
    {
      dateLastCrawled: '2018-12-24T15:23:39',
      deepLinks: [
        getMockBingWebPageDeepLinkObject(),
        getMockBingWebPageDeepLinkObject(),
      ],
      displayUrl: 'https://example.com',
      id: getMockUniqueID(),
      name: 'A <b>Really Awesome</b> Webpage',
      searchTags: [],
      snippet: `This <b>really awesome</b> website is definitely what you're looking for.`,
      url: getMockUniqueURL(),
    },
    overrides
  )
}

// https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-news-api-v7-reference#newsarticle
export const getMockBingNewsArticleResult = overrides => {
  return Object.assign(
    {},
    {
      category: 'Politics',
      clusteredArticles: undefined,
      contractualRules: [
        {
          _type: 'ContractualRules/TextAttribution',
          text: 'A Good News Site',
        },
      ],
      datePublished: '2018-12-24T15:23:39',
      description:
        'Something <b>truly incredible</b> and newsworthy happened! Wow. You cannot miss this article.',
      headline: undefined,
      id: getMockUniqueID(),
      image: {
        contentUrl: 'https://media.example.com/foo.png',
        thumbnail: {
          contentUrl: 'https://www.bing.com/some-url/',
          width: 700,
          height: 466,
        },
      },
      mentions: [
        {
          name: 'New York City',
        },
        {
          name: 'Madonna',
        },
      ],
      name: 'An <b>Incredible</b> Event in NYC',
      provider: [
        {
          _type: 'Organization',
          name: 'A Good News Site',
          image: {
            thumbnail: {
              contentUrl: 'https://www.bing.com/some-image-url/',
            },
          },
        },
      ],
      url: getMockUniqueURL(),
      video: undefined,
    },
    overrides
  )
}

export const getMockBingTextAdResult = overrides => {
  return Object.assign(
    {},
    {
      _type: 'Ads/TextAd',
      businessName: 'A-moo-zon',
      description: 'Hoof it to our website to shop dairy good electronics!',
      displayUrl: 'www.example.com/cow/',
      extensions: [],
      id: 'https://www.bingapis.com/api/v7/#Ads.1',
      isAdult: false,
      phoneNumber: '',
      position: 'Mainline',
      rank: 1,
      title: 'Buy Cow-puters on A-moo-zon',
      url: 'https://www.bing.com/fake-ad-url/',
      urlPingSuffix: '',
    },
    overrides
  )
}

// A successful search response object. Add more types as
// we use them.
// https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#searchresponse
export const getMockSuccessfulSearchQuery = () => {
  const query = 'tacoss'
  return {
    bing: {
      _type: 'SearchResponse',
      // computation: {},
      // entities: {},
      // images: {},
      news: {
        _type: 'News',
        id: 'https://api.cognitive.microsoft.com/api/v7/#News',
        value: [
          getMockBingNewsArticleResult(),
          getMockBingNewsArticleResult(),
          getMockBingNewsArticleResult(),
          getMockBingNewsArticleResult(),
        ],
      },
      queryContext: {
        alteredQuery: 'tacos',
        adultIntent: false,
        askUserForLocation: true,
        originalQuery: query,
      },
      rankingResponse: {
        // Very top results (e.g. computations, timezone)
        // pole: {},
        // Main results
        mainline: {
          items: [
            {
              answerType: 'WebPages',
              resultIndex: 0,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.0',
              },
            },
            {
              answerType: 'News',
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#News',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 1,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.1',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 2,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.2',
              },
            },
          ],
        },
        // Side results, typically images and entities
        // sidebar: {
        //   items: [],
        // },
      },
      // spellSuggestions: {},
      // relatedSearches: {},
      // videos: {}
      webPages: {
        _type: 'Web/WebAnswer',
        totalEstimatedMatches: 5250000,
        id: 'https://api.cognitive.microsoft.com/api/v7/#News',
        value: [
          getMockBingWebPageResult({
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.0',
          }),
          getMockBingWebPageResult({
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.1',
          }),
          getMockBingWebPageResult({
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.2',
          }),
        ],
        webSearchUrl: `https://www.bing.com/search?q=${query}`,
      },
    },
    bingExtras: {},
  }
}

// A mock search response object with a Bing error.
// https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#errorresponse
export const getMockErrorSearchQuery = () => ({
  bing: {
    _type: 'ErrorResponse',
    errors: [
      {
        code: 'InvalidAuthorization',
        subCode: 'AuthorizationMissing',
        message: 'Authorization is required.',
        moreDetails: 'Subscription key is not recognized.',
      },
    ],
  },
  bingExtras: {},
})
