import { get } from 'lodash/object'
import getMockCodefuelSearchResults from 'js/components/Search/getMockCodefuelSearchResults'

const ITEMS = 'Items'
const PLACEMENT_POLE = 'Pole'
const PLACEMENT_MAINLINE = 'Mainline'
const PLACEMENT_SIDEBAR = 'Sidebar'

// CodeFuel's top-level keys for each result type.
const CODEFUEL_RESULT_TYPE_KEY_WEBPAGE = 'OrganicResults'

// Result types used internally in components.
const RESULT_TYPE_WEBPAGES = 'WebPages'

const createWebpageResult = webpageData => {
  return {
    type: RESULT_TYPE_WEBPAGES,
    key: webpageData.TargetedUrl, // assume unique
    value: {
      displayUrl: webpageData.DisplayUrl,
      deepLinks: get(webpageData, 'DeepLinks', []).map(deepLink => ({
        name: deepLink.Title,
        url: deepLink.TargetedUrl,
        snippet: deepLink.Description,
      })),
      id: webpageData.TargetedUrl, // assume unique
      name: webpageData.Title,
      pixelUrl: webpageData.PixelUrl, // TODO: utilize this in the result component
      snippet: webpageData.Description,
      url: webpageData.TargetedUrl,
    },
    placement: webpageData.PlacementHint,
    rank: webpageData.Rank,
  }
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

  const allResults = [].concat(webpageResults)

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
