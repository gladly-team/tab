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

export const getMockBingComputationResult = overrides => {
  return Object.assign(
    {},
    {
      id: 'https://www.bing.com/api/v7/#Computation',
      expression: 'sqrt((4^2)+(8^2))',
      value: '8.94427191',
    },
    overrides
  )
}

export const getMockBingTimeZoneResult = overrides => {
  return Object.assign(
    {},
    {
      id: 'https://www.bing.com/api/v7/#TimeZone',
      // Query: "time in florida"
      primaryCityTime: {
        location: 'Tallahassee, Florida, United States',
        time: '2015-10-23T13:04:56.6774389Z',
        utcOffset: 'UTC-4',
      },
      otherCityTimes: [
        {
          location: 'Pensacola',
          time: '2015-10-23T12:04:56.6664294Z',
          utcOffset: 'UTC-5',
        },
      ],
    },
    overrides
  )
}

export const getMockBingVideosResult = overrides => {
  return Object.assign(
    {},
    {
      id: 'https://www.bingapis.com/api/v7/#Videos',
      isFamilyFriendly: true,
      readLink: 'https://www.bingapis.com/api/v7/videos/search?q=rick+roll',
      scenario: 'List',
      value: [
        {
          allowHttpsEmbed: true,
          allowMobileEmbed: true,
          contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          datePublished: '2009-10-25T06:57:33.0000000',
          description:
            'Rick Astley - Never Gonna Give You Up (Official Video) - Listen On Spotify: http://smarturl.it/AstleySpotify Learn more about the brand new album ‘Beautiful Life’: https://RickAstley.lnk.to/BeautifulLi... Buy On iTunes: http://smarturl.it/AstleyGHiTunes Amazon: http://smarturl.it/AstleyGHAmazon Follow Rick Astley Website: http://www ...',
          duration: 'PT3M33S',
          embedHtml:
            '<iframe width="1280" height="720" src="http://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>',
          encodingFormat: 'mp4',
          height: 720,
          hostPageDisplayUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          hostPageUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          hostPageUrlPingSuffix: 'DevEx,5617.1',
          isAccessibleForFree: true,
          isSuperfresh: false,
          motionThumbnailUrl:
            'https://tse3.mm.bing.net/th?id=OM.NrH36WeODxx7Tg_1557133268&pid=Api',
          name: 'Rick Astley - Never Gonna Give You Up (Video)',
          publisher: [{ name: 'YouTube' }],
          thumbnail: { width: 160, height: 119 },
          thumbnailUrl:
            'https://tse3.mm.bing.net/th?id=OVP.6PGH-QJhVEnKeMu2-91ajQHfFn&pid=Api',
          viewCount: 573320051,
          webSearchUrl:
            'https://www.bing.com/videos/search?q=rick%20roll&view=detail&mid=4E7B1C0F8E67E9F7B1364E7B1C0F8E67E9F7B136',
          webSearchUrlPingSuffix: 'DevEx,5618.1',
          width: 1280,
        },
        {
          webSearchUrl:
            'https://www.bing.com/videos/search?q=rick%20roll&view=detail&mid=CA767BEE3A9FFDBBE775CA767BEE3A9FFDBBE775',
          webSearchUrlPingSuffix: 'DevEx,5620.1',
          name: 'Rick astley Together Forever remix tema',
          description: 'Rick astley Together Forever remix tema',
          thumbnailUrl:
            'https://tse1.mm.bing.net/th?id=OVF.jRV6abk10leVreAar%2fx1Zg&pid=Api',
          datePublished: '2019-06-25T02:25:35.0000000',
          publisher: [
            {
              name: 'YouTube',
            },
          ],
          isAccessibleForFree: true,
          contentUrl: 'https://www.youtube.com/watch?v=kg9_lJbH8Fw',
          hostPageUrl: 'https://www.youtube.com/watch?v=kg9_lJbH8Fw',
          hostPageUrlPingSuffix: 'DevEx,5619.1',
          encodingFormat: '',
          hostPageDisplayUrl: 'https://www.youtube.com/watch?v=kg9_lJbH8Fw',
          width: 1280,
          height: 720,
          duration: 'PT6M54S',
          embedHtml:
            '<iframe width="1280" height="720" src="http://www.youtube.com/embed/kg9_lJbH8Fw?autoplay=1" frameborder="0" allowfullscreen></iframe>',
          allowHttpsEmbed: true,
          viewCount: 2,
          thumbnail: {
            width: 160,
            height: 120,
          },
          allowMobileEmbed: true,
          isSuperfresh: true,
        },
        {
          webSearchUrl:
            'https://www.bing.com/videos/search?q=rick%20roll&view=detail&mid=150ED418D5753FA363B9150ED418D5753FA363B9',
          webSearchUrlPingSuffix: 'DevEx,5622.1',
          name: 'Rick Astley - Never Gonna Give You Up | Dark: Season 2 OST',
          description:
            'Music from Dark: Season 2 (2019) distributed by Netflix. Dark: Season 2 (Soundtrack) by Various Artists. Playlist: https://www.youtube.com/playlist?list=PLDisKgcnAC4S1uAqB-rNIGvmocSvexdRB',
          thumbnailUrl:
            'https://tse3.mm.bing.net/th?id=OVF.x3pEJBaPXV3CVbY3T%2fD1kg&pid=Api',
          datePublished: '2019-06-22T20:11:46.0000000',
          publisher: [
            {
              name: 'YouTube',
            },
          ],
          isAccessibleForFree: true,
          contentUrl: 'https://www.youtube.com/watch?v=qlGq-ZlDlus',
          hostPageUrl: 'https://www.youtube.com/watch?v=qlGq-ZlDlus',
          hostPageUrlPingSuffix: 'DevEx,5621.1',
          encodingFormat: '',
          hostPageDisplayUrl: 'https://www.youtube.com/watch?v=qlGq-ZlDlus',
          width: 1280,
          height: 720,
          duration: 'PT4M6S',
          embedHtml:
            '<iframe width="1280" height="720" src="http://www.youtube.com/embed/qlGq-ZlDlus?autoplay=1" frameborder="0" allowfullscreen></iframe>',
          allowHttpsEmbed: true,
          viewCount: 2973,
          thumbnail: {
            width: 160,
            height: 120,
          },
          allowMobileEmbed: true,
          isSuperfresh: true,
        },
        {
          webSearchUrl:
            'https://www.bing.com/videos/search?q=rick%20roll&view=detail&mid=6438FA6C7D3B90C886B36438FA6C7D3B90C886B3',
          webSearchUrlPingSuffix: 'DevEx,5624.1',
          name: 'Rick Roll 2019 (Shot-for-Shot Recreation)',
          description:
            "Lyrics We're no strangers to love You know the rules and so do I A full commitment's what I'm thinking of You wouldn't get this from any other guy I just wanna tell you how I'm feeling Gotta make you understand Never gonna give you up Never gonna let you down Never gonna run around and desert you Never gonna make you cry Never gonna say goodbye ...",
          thumbnailUrl:
            'https://tse4.mm.bing.net/th?id=OVF.pBT6HBIt8%2fgAlcWyV8TZbg&pid=Api',
          datePublished: '2019-06-21T21:56:30.0000000',
          publisher: [
            {
              name: 'YouTube',
            },
          ],
          isAccessibleForFree: true,
          contentUrl: 'https://www.youtube.com/watch?v=_GpjEyFSq-0',
          hostPageUrl: 'https://www.youtube.com/watch?v=_GpjEyFSq-0',
          hostPageUrlPingSuffix: 'DevEx,5623.1',
          encodingFormat: '',
          hostPageDisplayUrl: 'https://www.youtube.com/watch?v=_GpjEyFSq-0',
          width: 1280,
          height: 720,
          duration: 'PT3M33S',
          embedHtml:
            '<iframe width="1280" height="720" src="http://www.youtube.com/embed/_GpjEyFSq-0?autoplay=1" frameborder="0" allowfullscreen></iframe>',
          allowHttpsEmbed: true,
          viewCount: 133,
          thumbnail: {
            width: 160,
            height: 120,
          },
          allowMobileEmbed: true,
          isSuperfresh: true,
        },
      ],
      webSearchUrl: 'https://www.bing.com/videos/search?q=rick+roll',
      webSearchUrlPingSuffix: 'Foo,1234.1',
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
      extensions: [getMockBingTextAdSiteLinkExtensionObject()],
      id: 'https://www.bingapis.com/api/v7/#Ads.1',
      isAdult: false,
      phoneNumber: '',
      position: 'Mainline',
      rank: 1,
      title: 'Buy Cow-puters on A-moo-zon',
      url: 'https://www.bing.com/fake-ad-url/',
      urlPingSuffix: 'Something,123',
    },
    overrides
  )
}

export const getMockBingTextAdSiteLinkExtensionObject = overrides => {
  return Object.assign(
    {},
    {
      _type: 'Ads/SiteLinkExtension',
      impressionToken: '17',
      isCreatedDynamically: false,
      sitelinks: [
        getMockBingTextAdSiteLink(),
        getMockBingTextAdSiteLink(),
        getMockBingTextAdSiteLink(),
        getMockBingTextAdSiteLink(),
      ],
    },
    overrides
  )
}

export const getMockBingTextAdSiteLink = overrides => {
  return Object.assign(
    {},
    {
      // The descriptions will be a max of 35 characters each.
      descriptionLine1: 'This is a helpful other link.',
      descriptionLine2: 'Check it out!',
      text: 'Some Related Link',
      link: getMockUniqueURL(),
      pingUrlSuffix: 'Foo,1234.0',
      impressionToken: '18',
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
      instrumentation: {
        _type: 'ResponseInstrumentation',
        pageLoadPingUrl:
          'https://www.bingapis.com/api/ping/pageload?Some=Data&Type=Thing',
        pingUrlBase: 'https://www.bingapis.com/api/ping?Some=Data',
      },
      queryContext: {
        alteredQuery: 'tacos',
        adultIntent: false,
        askUserForLocation: true,
        originalQuery: query,
      },
      ads: {
        // Our API will not return the impressionFeedbackUrl
        // impressionFeedbackUrl: 'https://www.bingapis.com/some-impression-url/',
        readLink: 'https://www.bingapis.com/some-readlink/',
        value: [
          getMockBingTextAdResult(),
          getMockBingTextAdResult(),
          getMockBingTextAdResult(),
        ],
        visibilityFeedbackUrl: 'https://www.bingapis.com/some-visibility-url/',
      },
      computation: {
        expression: 'sqrt((4^2) + (8^2))',
        id: 'https://www.bingapis.com/api/v7/#Computation',
        value: '8.94427191',
      },
      // entities: {},
      // images: {},
      news: {
        _type: 'News',
        id: 'https://api.cognitive.microsoft.com/api/v7/#News',
        readLink: 'https://www.bingapis.com/some-readlink/',
        value: [
          getMockBingNewsArticleResult(),
          getMockBingNewsArticleResult(),
          getMockBingNewsArticleResult(),
          getMockBingNewsArticleResult(),
        ],
      },
      rankingResponse: {
        // Very top results (e.g. computations, timezone)
        // pole: {},
        // Main results
        mainline: {
          items: [
            {
              answerType: 'TimeZone',
              value: { id: 'https://www.bingapis.com/api/v7/#TimeZone' },
              id: 'https://www.bingapis.com/api/v7/#TimeZone',
            },
            {
              answerType: 'Computation',
              value: { id: 'https://www.bingapis.com/api/v7/#Computation' },
              id: 'https://www.bingapis.com/api/v7/#Computation',
            },
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
            {
              answerType: 'Videos',
              value: { id: 'https://www.bingapis.com/api/v7/#Videos' },
              id: 'https://www.bingapis.com/api/v7/#Videos',
            },
          ],
        },
        // Side results, typically images and entities
        // sidebar: {
        //   items: [],
        // },
      },
      // relatedSearches: {},
      // spellSuggestions: {},
      timeZone: {
        id: 'https://www.bing.com/api/v7/#TimeZone',
        // Query: "time in florida"
        primaryCityTime: {
          location: 'Tallahassee, Florida, United States',
          time: '2015-10-23T13:04:56.6774389Z',
          utcOffset: 'UTC-4',
        },
        otherCityTimes: [
          {
            location: 'Pensacola',
            time: '2015-10-23T12:04:56.6664294Z',
            utcOffset: 'UTC-5',
          },
        ],
      },
      videos: getMockBingVideosResult(),
      webPages: {
        _type: 'Web/WebAnswer',
        readLink: 'https://www.bingapis.com/some-readlink/',
        someResultsRemoved: true,
        totalEstimatedMatches: 5250000,
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
        webSearchUrlPingSuffix: 'Foo,1234.1',
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
