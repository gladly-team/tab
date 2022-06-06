export const searchEngineData = [
  {
    name: 'Search for a Cause',
    id: 'SearchForACause',

    // The {searchTerms} placeholder should be filled in client-side.
    searchUrl: 'https://tab.gladly.io/search/v2?q={searchTerms}',
    rank: 0,
    isCharitable: true,
    inputPrompt: 'Search for a Cause',
  },
  {
    name: 'Google',
    id: 'Google',
    searchUrl: 'https://www.google.com/search?q={searchTerms}',
    rank: 1,
    isCharitable: false,
    inputPrompt: 'Search Google',
  },
  {
    name: 'Ecosia',
    id: 'Ecosia',
    searchUrl: 'https://www.ecosia.org/search?q={searchTerms}',
    rank: 2,
    isCharitable: false,
    inputPrompt: 'Search Ecosia',
  },
  {
    name: 'DuckDuckGo',
    id: 'DuckDuckGo',
    searchUrl: 'https://duckduckgo.com/?q={searchTerms}',
    rank: 3,
    isCharitable: false,
    inputPrompt: 'Search DuckDuckGo',
  },
  {
    name: 'Bing',
    id: 'Bing',
    searchUrl: 'https://www.bing.com/search?q={searchTerms}',
    rank: 4,
    isCharitable: false,
    inputPrompt: 'Search Bing',
  },
  {
    name: 'Yahoo',
    id: 'Yahoo',
    searchUrl: 'https://tab.gladly.io/search/v2?q={searchTerms}',
    rank: 5,
    isCharitable: false,
    inputPrompt: 'Search Yahoo',
  },
]

export const VALID_SEARCH_ENGINES = searchEngineData.map(data => data.id)
