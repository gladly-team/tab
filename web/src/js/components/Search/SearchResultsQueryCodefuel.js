import React from 'react'
import PropTypes from 'prop-types'
import logger from 'js/utils/logger'
import SearchResultsCodefuel from 'js/components/Search/SearchResultsCodefuel'
import fetchCodefuelSearchResults from 'js/components/Search/fetchCodefuelSearchResults'
import { isReactSnapClient } from 'js/utils/search-utils'
import { makePromiseCancelable } from 'js/utils/utils'
// import { setBingClientID } from 'js/utils/local-user-data-mgr'

class SearchResultsQueryBing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResultsData: {
        resultsCount: undefined,
        results: {
          mainline: [],
          sidebar: [],
        },
      },
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
    const { page, query } = this.props
    if (!query) {
      return
    }

    // Reset state of search results.
    this.setState({
      queryInProgress: true,
      queryReturned: false,
      unexpectedSearchError: false,
    })

    try {
      this.cancelablePromise = makePromiseCancelable(
        fetchCodefuelSearchResults({
          query,
          ...(page && { page }),
        })
      )
      const searchResults = await this.cancelablePromise.promise

      // TODO: handle errors
      // const searchErrors = get(searchResults, 'bing.errors', [])

      this.setState({
        queryInProgress: false,
        queryReturned: true,
        searchResultsData: searchResults,
        // unexpectedSearchError: searchErrors.length > 0,
      })

      // Log any errors.
      // if (searchErrors.length) {
      //   searchErrors.forEach(err => {
      //     logger.error(err)
      //   })
      // }
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

    // Whether there are no search results for whatever reason.
    const isEmptyQuery = this.state.mounted && !query
    return (
      <SearchResultsCodefuel
        data={searchResultsData}
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
