import React from 'react'
import PropTypes from 'prop-types'
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
    const { isAdBlockerEnabled, page, query } = this.props
    const {
      noSearchResults,
      queryInProgress,
      searchResultsData,
      unexpectedSearchError,
    } = this.state

    // Whether there are no search results for whatever reason.
    const isEmptyQuery = this.state.mounted && !query
    return (
      <SearchResultsBing
        data={searchResultsData}
        isAdBlockerEnabled={isAdBlockerEnabled}
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
  isAdBlockerEnabled: PropTypes.bool.isRequired,
  query: PropTypes.string,
  page: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  searchSource: PropTypes.string,
}

SearchResultsQueryBing.defaultProps = {
  isAdBlockerEnabled: false,
  page: 1,
  style: {},
}

export default SearchResultsQueryBing
