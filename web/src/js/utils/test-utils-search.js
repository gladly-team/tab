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
      snippet: 'This is <b>a snippet</b> related to the site.',
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
