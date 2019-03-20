import React from 'react'
import PropTypes from 'prop-types'
import { range } from 'lodash/util'
import { Helmet } from 'react-helmet'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import logger from 'js/utils/logger'
import fetchSearchResults from 'js/components/Search/fetchSearchResults'
import YPAConfiguration from 'js/components/Search/YPAConfiguration'
import { isReactSnapClient } from 'js/utils/search-utils'
import { getCurrentUser } from 'js/authentication/user'
import LogSearchMutation from 'js/mutations/LogSearchMutation'

// This component expects the YPA search JS to already have
// executed and for the `searchforacause` global variable
// to be defined.

const styles = theme => ({
  searchResultsParentContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  searchAdsContainer: {
    '& iframe': {
      width: '100%',
    },
  },
  searchResultsContainer: {
    marginTop: 6,
    '& iframe': {
      width: '100%',
    },
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 520,
    margin: 'auto auto 20px auto',
  },
  paginationButton: {
    minWidth: 40,
  },
})

class SearchResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      noSearchResults: false,
      unexpectedSearchError: false,
    }
  }

  componentDidMount() {
    const { query } = this.props

    // Fetch a query if one exists on mount.
    if (query) {
      this.getSearchResults()
    }

    // When prerendering the page, add an inline script to fetch
    // search results even before parsing our app JS.
    // This adds any errors to a window variable and emits an
    // event so we can update state here.
    if (isReactSnapClient()) {
      try {
        // If there is a query on page load, fetch it.
        const js = `
          try {
            if (new URLSearchParams(window.location.search).get('q')) {
              var config = ${JSON.stringify(YPAConfiguration)}
              config.ypaAdSlotInfo[1].ypaOnNoAd = function(err) {
                window.searchforacause.search.YPAErrorOnPageLoad = err
                var evt = new CustomEvent('searchresulterror', { detail: err })
                window.dispatchEvent(evt)
              }
              var page = new URLSearchParams(window.location.search).get('page')
              if (page) {
                config.ypaPageCount = page
              }
              window.ypaAds.insertMultiAd(config)
              window.searchforacause.search.fetchedOnPageLoad = true
            }
          } catch (e) {
            console.error(e)
          }
        `
        const s = document.createElement('script')
        s.type = 'text/javascript'
        s.dataset['testId'] = 'search-inline-script'
        s.innerHTML = js

        // Render the script immediately after our app's DOM root.
        // Important: the target divs for search results must exist
        // in the DOM *before* we call YPA's JS. Otherwise, YPA will
        // not fetch search results.
        const reactRoot = document.getElementById('root')
        reactRoot.parentNode.insertBefore(s, reactRoot.nextSibling)
      } catch (e) {
        console.error(
          'Could not prerender the inline script to fetch search results.'
        )
      }
    }

    // Listen for any error/empty search results from fetching
    // search results via the inline script.
    window.addEventListener(
      'searchresulterror',
      this.handleSearchResultsEvent.bind(this),
      false
    )

    // Update state with any error/empty search results that
    // already occurred from fetching search results via the
    // inline script.
    const searchErr = window.searchforacause.search.YPAErrorOnPageLoad
    if (searchErr) {
      this.handleSearchResultsError(searchErr)
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

  componentWillUnmount() {
    // Remove the listener for any error/empty search results
    // from fetching search results via the inline script.
    window.removeEventListener(
      'searchresulterror',
      this.handleSearchResultsEvent.bind(this),
      false
    )
  }

  handleSearchResultsEvent(event) {
    this.handleSearchResultsError(event.detail)
  }

  handleSearchResultsError(err) {
    if (err.URL_UNREGISTERED) {
      this.setState({
        unexpectedSearchError: true,
      })
      logger.error(
        new Error('Domain is not registered with our search partner.')
      )
    } else if (err.NO_COVERAGE) {
      // No results for this search.
      this.setState({
        noSearchResults: true,
      })
    } else {
      this.setState({
        unexpectedSearchError: true,
      })
      logger.error(new Error('Unexpected search error:', err))
    }
  }

  getSearchResults() {
    if (!window.ypaAds) {
      logger.error(`
        Search provider Javascript not loaded.
        Could not fetch search results.`)
      this.setState({
        unexpectedSearchError: true,
      })
      return
    }
    const { page, query } = this.props
    if (!query) {
      return
    }

    // If this is the first query, we may have already fetched
    // results via inline script. If so, don't re-fetch them.
    const alreadyFetchedQuery = window.searchforacause.search.fetchedOnPageLoad
    if (alreadyFetchedQuery) {
      window.searchforacause.search.fetchedOnPageLoad = false
      return
    }

    // Reset state of search results.
    this.setState({
      noSearchResults: false,
      unexpectedSearchError: false,
    })

    try {
      fetchSearchResults(query, this.handleSearchResultsError.bind(this), page)
    } catch (e) {
      this.setState({
        unexpectedSearchError: true,
      })
      logger.error(e)
    }

    // Log the search event.
    // We're not passing the user as a prop to this component because
    // we don't want to delay the component mount.
    getCurrentUser().then(user => {
      if (user && user.id) {
        LogSearchMutation({
          userId: user.id,
        })
      }
    })
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
    const { classes, page, query, style, theme } = this.props

    // Include 8 pages total, 4 lower and 4 higher when possible.
    // Page 9999 is the maximum, so stop there.
    const MIN_PAGE = 1
    const MAX_PAGE = 9999
    const paginationIndices = range(
      Math.max(MIN_PAGE, Math.min(page - 4, MAX_PAGE - 8)),
      Math.min(MAX_PAGE + 1, Math.max(page + 4, MIN_PAGE + 8))
    )
    return (
      <div
        className={classes.searchResultsParentContainer}
        style={Object.assign(
          {},
          {
            // Min height prevents visibly shifting content below,
            // like the footer.
            minHeight:
              this.state.noSearchResults || this.state.unexpectedSearchError
                ? 0
                : 1200,
          },
          style
        )}
      >
        <Helmet>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
        </Helmet>
        {this.state.noSearchResults ? (
          <Typography variant={'body1'} gutterBottom>
            No results found for{' '}
            <span style={{ fontWeight: 'bold' }}>{query}</span>
          </Typography>
        ) : null}
        {this.state.unexpectedSearchError ? (
          <Typography variant={'body1'} gutterBottom>
            Unable to search at this time.
          </Typography>
        ) : null}
        <div
          id="search-ads"
          className={classes.searchAdsContainer}
          // Important: if these containers are unmounted or mutated,
          // YPA's JS will cancel the call to fetch search results.
          // Using dangerouslySetInnerHTML and suppressHydrationWarning
          // prevents rerendering this element during hydration:
          // https://github.com/reactjs/rfcs/pull/46#issuecomment-385182716
          // Related: https://github.com/facebook/react/issues/6622
          dangerouslySetInnerHTML={{
            __html: '',
          }}
          suppressHydrationWarning
        />
        <div
          id="search-results"
          className={classes.searchResultsContainer}
          dangerouslySetInnerHTML={{
            __html: '',
          }}
          suppressHydrationWarning
        />
        <div
          data-test-id={'pagination-container'}
          className={classes.paginationContainer}
          style={{
            display:
              this.state.noSearchResults || this.state.unexpectedSearchError
                ? 'none'
                : 'block',
          }}
        >
          {page > MIN_PAGE ? (
            <Button
              data-test-id={'pagination-previous'}
              className={classes.paginationButton}
              onClick={() => {
                this.changePage(page - 1)
              }}
            >
              PREVIOUS
            </Button>
          ) : null}
          {paginationIndices.map(pageNum => (
            <Button
              key={`page-${pageNum}`}
              className={classes.paginationButton}
              data-test-id={`pagination-${pageNum}`}
              {...pageNum === page && {
                color: 'secondary',
                disabled: true,
              }}
              style={{
                ...(pageNum === page && {
                  color: theme.palette.secondary.main,
                }),
              }}
              onClick={() => {
                this.changePage(pageNum)
              }}
            >
              {pageNum}
            </Button>
          ))}
          {page < MAX_PAGE ? (
            <Button
              data-test-id={'pagination-next'}
              className={classes.paginationButton}
              onClick={() => {
                this.changePage(page + 1)
              }}
            >
              NEXT
            </Button>
          ) : null}
        </div>
      </div>
    )
  }
}

SearchResults.propTypes = {
  query: PropTypes.string,
  page: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  style: PropTypes.object,
  theme: PropTypes.object.isRequired,
}

SearchResults.defaultProps = {
  page: 1,
  style: {},
}

export default withStyles(styles, { withTheme: true })(SearchResults)
