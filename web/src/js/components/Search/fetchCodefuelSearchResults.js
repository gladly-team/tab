import getMockCodefuelSearchResults from 'js/components/Search/getMockCodefuelSearchResults'

const formatSearchResults = rawSearchResults => {
  return {
    resultsCount: 12,
    results: {
      pole: [],
      mainline: [],
      sidebar: [],
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
