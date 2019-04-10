import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import logger from 'js/utils/logger'
import SearchResultsBing from 'js/components/Search/SearchResultsBing'
import fetchBingSearchResults from 'js/components/Search/fetchBingSearchResults'
import { isReactSnapClient } from 'js/utils/search-utils'
import { getCurrentUser } from 'js/authentication/user'
import LogSearchMutation from 'js/mutations/LogSearchMutation'

class SearchResultsQueryBing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResultsData: null,
      queryInProgress: false,
      noSearchResults: false,
      unexpectedSearchError: false,
      mounted: false, // i.e. we've mounted to a real user, not pre-rendering
    }
  }

  componentDidMount() {
    const { query } = this.props

    // Fetch a query if one exists on mount.
    if (query) {
      this.getSearchResults()
    }

    // Mark that we've mounted for a real user. In other words, this
    // is not React Snap prerendering.
    if (!isReactSnapClient()) {
      this.setState({
        mounted: true,
      })
    }
  }

  componentDidUpdate(prevProps) {
    // Fetch search results if a query exists and either the page
    // or query has changed.
    if (
      this.props.query &&
      (this.props.page !== prevProps.page ||
        this.props.query !== prevProps.query)
    ) {
      this.getSearchResults()
    }
  }

  async getSearchResults() {
    const { query, searchSource } = this.props
    if (!query) {
      return
    }

    // Log the search event.
    // We're not passing the user as a prop to this component because
    // we don't want to delay the component mount.
    getCurrentUser().then(user => {
      if (user && user.id) {
        LogSearchMutation({
          userId: user.id,
          ...(searchSource && { source: searchSource }),
        })
      }
    })

    // Reset state of search results.
    this.setState({
      noSearchResults: false,
      queryInProgress: true,
      unexpectedSearchError: false,
    })

    try {
      const searchResults = await fetchBingSearchResults(query)
      // console.log('searchResults', searchResults)
      this.setState({
        searchResultsData: searchResults,
        queryInProgress: false,
      })
    } catch (e) {
      this.setState({
        unexpectedSearchError: true,
        queryInProgress: false,
      })
      logger.error(e)
    }
  }

  /**
   * Restructure the raw search results data into search sections with
   * each item's full data.
   * @param {Object} data - The search results data returned from the API
   * @return {Object} searchResults - The restructured search results data
   * @return {Array<SearchResultItem>} searchResults.pole - Search result items in the "pole"
   *   (i.e. most prominent) display position.
   * @return {Array<SearchResultItem>} searchResults.mainline - Search result items in the
   *   "mainline" (i.e. second-most-prominent) display position.
   * @return {Array<SearchResultItem>} searchResults.sidebar - Search result items in the "sidebar"
   *   (i.e. less prominent) display position.
   * The SearchResultItem has a structure of:
   *   {String} SearchResultItem.type - The type of search result (e.g. WebPages, News, Videos).
   *   {String} SearchResultItem.key - A unique key for this search result item
   *   {Object} SearchResultItem.value - The raw data for this search result item as
   *.    returned by the API.
   */
  restructureSearchResultsData(data) {
    const searchResultSections = ['pole', 'mainline', 'sidebar']
    const restructuredData = searchResultSections.reduce(
      (newData, sectionName) => {
        // Get the ranked list for this section.
        const rankingItems = get(
          data,
          `rankingResponse.${sectionName}.items`,
          []
        )

        // For each ranked item, get the actual data for that item.
        // https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/Bing-Web-Search/public/js/script.js#L168
        const newItems = rankingItems.map(itemRankingData => {
          const typeName =
            itemRankingData.answerType[0].toLowerCase() +
            itemRankingData.answerType.slice(1)
          // https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/Bing-Web-Search/public/js/script.js#L172
          const itemData = !isNil(itemRankingData.resultIndex)
            ? // One result of the specified type (e.g., one webpage link)
              get(data, `${typeName}.value[${itemRankingData.resultIndex}]`)
            : // All results of the specified type (e.g., all videos)
              get(data, `${typeName}.value`)

          // Return null if we couldn't find the result item data.
          if (!(itemRankingData.answerType && itemData)) {
            // console.error(`Couldn't find item data for:`, itemRankingData)
            return null
          }
          return {
            type: itemRankingData.answerType,
            key: itemData.id
              ? `${itemRankingData.answerType}-${itemData.id}`
              : itemRankingData.answerType,
            value: itemData,
          }
        })
        newData[sectionName] = newItems
        return newData
      },
      {}
    )
    return restructuredData
  }

  changePage(newPageIndex) {
    const { onPageChange, page } = this.props
    if (newPageIndex === page) {
      return
    }
    onPageChange(newPageIndex)

    // Scroll to the top of the page.
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  render() {
    const { page, query } = this.props
    const {
      noSearchResults,
      queryInProgress,
      searchResultsData,
      unexpectedSearchError,
    } = this.state
    const restructuredData = this.restructureSearchResultsData(
      searchResultsData
    )

    // Whether there are no search results for whatever reason.
    const isEmptyQuery = this.state.mounted && !query
    return (
      <SearchResultsBing
        data={restructuredData}
        isEmptyQuery={isEmptyQuery}
        isError={unexpectedSearchError}
        isQueryInProgress={queryInProgress}
        noSearchResults={noSearchResults}
        query={query}
        onPageChange={this.changePage}
        page={page}
      />
    )
  }
}

SearchResultsQueryBing.propTypes = {
  query: PropTypes.string,
  page: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  searchSource: PropTypes.string,
}

SearchResultsQueryBing.defaultProps = {
  page: 1,
  style: {},
}

export default SearchResultsQueryBing
