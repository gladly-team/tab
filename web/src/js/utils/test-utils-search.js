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
export const getMockBingWebPageResult = overrides => {
  return Object.assign(
    {},
    {
      dateLastCrawled: '2018-12-24T15:23:39',
      deepLinks: [
        {
          name: 'This site is related',
          url: getMockUniqueURL(),
          urlPingSuffix: 'something',
          snippet: 'This is <b>a snippet</b> related to the site.',
        },
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
