import { get } from 'lodash/object'
import getMockCodefuelSearchResults from 'js/components/Search/getMockCodefuelSearchResults'

const ITEMS = 'Items'
const PLACEMENT_POLE = 'Pole'
const PLACEMENT_MAINLINE = 'Mainline'
const PLACEMENT_SIDEBAR = 'Sidebar'

// CodeFuel's top-level keys for each result type.
const CODEFUEL_RESULT_TYPE_KEY_WEBPAGE = 'OrganicResults'
const CODEFUEL_RESULT_TYPE_KEY_VIDEO = 'VideoResults'

// Result types used internally in components.
const RESULT_TYPE_WEBPAGES = 'WebPages'
const RESULT_TYPE_VIDEOS = 'Videos'

// Create a generic search result object
const createSearchResult = ({
  type,
  key,
  pixelUrl,
  placement,
  rank,
  value,
}) => ({
  type,
  key,
  pixelUrl,
  placement,
  rank,
  value,
})

// Takes an object (raw CodeFuel organic webpage data) and returns our
// internal webpage result object.
const createWebpageResult = data => {
  return createSearchResult({
    type: RESULT_TYPE_WEBPAGES,
    key: data.TargetedUrl, // assume unique
    pixelUrl: data.PixelUrl, // TODO: utilize this in the result component
    placement: data.PlacementHint,
    rank: data.Rank,
    value: {
      displayUrl: data.DisplayUrl,
      deepLinks: get(data, 'DeepLinks', []).map(deepLink => ({
        name: deepLink.Title,
        url: deepLink.TargetedUrl,
        snippet: deepLink.Description,
      })),
      id: data.TargetedUrl, // assume unique
      name: data.Title,
      snippet: data.Description,
      url: data.TargetedUrl,
    },
  })
}

// Takes an array (all videos, raw CodeFuel data) and returns an array
// of our video result objects.
const createVideoResults = (data = []) => {
  if (!data.length) {
    return []
  }
  const firstItem = data[0]
  return createSearchResult({
    type: RESULT_TYPE_VIDEOS,
    key: firstItem.TargetedUrl,
    pixelUrl: firstItem.PixelUrl, // TODO: utilize this in the result component
    placement: firstItem.PlacementHint, // all items have the same placement
    value: data.map(videoItem => ({
      allowHttpsEmbed: videoItem.AllowHttpsEmbed,
      allowMobileEmbed: videoItem.AllowMobileEmbed,
      // contentUrl: undefined,
      datePublished: videoItem.DatePublished,
      description: videoItem.Description,
      duration: videoItem.Duration,
      embedHtml: videoItem.EmbedHtml,
      // encodingFormat: undefined,
      // height: undefined,
      // hostPageDisplayUrl: '',
      hostPageUrl: videoItem.TargetedUrl,
      // hostPageUrlPingSuffix: undefined,
      // isAccessibleForFree: undefined,
      // isSuperfresh: undefined,
      // motionThumbnailUrl: undefined,
      name: videoItem.Title,
      publisher: [
        {
          name: videoItem.Publisher,
        },
      ],
      thumbnail: {
        width: videoItem.ThumbnailWidth,
        height: videoItem.ThumbnailHeight,
      },
      thumbnailUrl: videoItem.ThumbnailUrl,
      viewCount: videoItem.ViewCount,
      // webSearchUrl: undefined,
      // webSearchUrlPingSuffix: undefined,
      // width: undefined,
    })),
  })
}

const formatSearchResults = rawSearchResults => {
  console.log('raw search results:', rawSearchResults)

  const poleResults = []
  const mainlineResults = []
  const sidebarResults = []

  // Iterate through result data, formatting each result's data
  // and assigning them to the appropriate position (mainline,
  // sidebar, etc).
  const webpageResults = get(
    rawSearchResults,
    [CODEFUEL_RESULT_TYPE_KEY_WEBPAGE, ITEMS],
    []
  ).map(item => createWebpageResult(item))

  const videoResults = createVideoResults(
    get(rawSearchResults, [CODEFUEL_RESULT_TYPE_KEY_VIDEO, ITEMS], [])
  )

  const allResults = [].concat(webpageResults).concat(videoResults)
  allResults.forEach(item => {
    switch (item.placement) {
      case PLACEMENT_POLE: {
        poleResults.push(item)
        break
      }
      case PLACEMENT_MAINLINE: {
        mainlineResults.push(item)
        break
      }
      case PLACEMENT_SIDEBAR: {
        sidebarResults.push(item)
        break
      }
      default:
        break
    }
  })
  return {
    resultsCount: get(rawSearchResults, [
      CODEFUEL_RESULT_TYPE_KEY_WEBPAGE,
      'NumResults',
    ]),
    results: {
      pole: poleResults,
      mainline: mainlineResults,
      sidebar: sidebarResults,
    },
  }
}

const fetchCodefuelSearchResults = async () => {
  console.log('Fetch CodeFuel search results.')
  const rawSearchResults = await getMockCodefuelSearchResults()
  const formattedSearchResults = formatSearchResults(rawSearchResults)
  return formattedSearchResults
}

export default fetchCodefuelSearchResults
