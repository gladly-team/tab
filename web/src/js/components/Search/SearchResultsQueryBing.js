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
import { makePromiseCancelable } from 'js/utils/utils'
import { setBingClientID } from 'js/utils/local-user-data-mgr'
import { getSearchResultCountPerPage } from 'js/utils/search-utils'

class SearchResultsQueryBing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResultsData: null,
      queryInProgress: false,
      queryReturned: false,
      unexpectedSearchError: false,
      mounted: false, // i.e. we've mounted to a real user, not pre-rendering
    }
    this.cancelablePromise = null
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

  componentWillUnmount() {
    if (this.cancelablePromise && this.cancelablePromise.cancel) {
      this.cancelablePromise.cancel()
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
    const { page, query, searchSource } = this.props
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
      queryInProgress: true,
      queryReturned: false,
      unexpectedSearchError: false,
    })

    try {
      const offset = getSearchResultCountPerPage() * (page - 1)
      this.cancelablePromise = makePromiseCancelable(
        fetchBingSearchResults(query, {
          ...(offset && { offset }),
        })
      )
      const searchResults = await this.cancelablePromise.promise
      const searchErrors = get(searchResults, 'bing.errors', [])

      this.setState({
        queryInProgress: false,
        queryReturned: true,
        searchResultsData: searchResults,
        // https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#errorresponse
        unexpectedSearchError: searchErrors.length > 0,
      })

      // If the X-MSEdge-ClientID exists in the response, store it. See:
      // https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#headers
      // We return this value in the "bingExtras.msEdgeClientID".
      try {
        const bingClientID = get(searchResults, 'bingExtras.msEdgeClientID')
        if (bingClientID) {
          setBingClientID(bingClientID)
        }
      } catch (e) {
        logger.error(e)
      }

      // If Bing returns errors, log them.
      if (searchErrors.length) {
        searchErrors.forEach(err => {
          logger.error(err)
        })
      }
    } catch (e) {
      if (e && e.isCanceled) {
        return
      }
      this.setState({
        queryInProgress: false,
        queryReturned: true,
        unexpectedSearchError: true,
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
        newData[sectionName] = rankingItems
          .map(itemRankingData => {
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
          // Filter null item data.
          .filter(itemData => !!itemData)
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
      queryInProgress,
      queryReturned,
      searchResultsData,
      unexpectedSearchError,
    } = this.state
    const restructuredData = this.restructureSearchResultsData(
      get(searchResultsData, 'bing')
    )

    // Whether there are no search results for whatever reason.
    const isEmptyQuery = this.state.mounted && !query
    return (
      <SearchResultsBing
        data={restructuredData}
        isEmptyQuery={isEmptyQuery}
        isError={unexpectedSearchError}
        isQueryInProgress={queryInProgress}
        query={query}
        queryReturned={queryReturned}
        onPageChange={this.changePage.bind(this)}
        page={page}
      />
    )
  }
}

SearchResultsQueryBing.propTypes = {
  query: PropTypes.string,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  searchSource: PropTypes.string,
}

SearchResultsQueryBing.defaultProps = {
  page: 1,
  style: {},
}

export default SearchResultsQueryBing
