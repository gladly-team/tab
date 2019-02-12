import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import logger from 'js/utils/logger'
import fetchSearchResults from 'js/components/Search/fetchSearchResults'
import YPAConfiguration from 'js/components/Search/YPAConfiguration'
import { isReactSnapClient } from 'js/utils/search-utils'

// This component expects the YPA search JS to already have
// executed and for the `searchforacause` global variable
// to be defined.

const styles = theme => ({
  searchAdsContainer: {
    '& iframe': {
      width: '100%',
    },
    // To address the unnecessary bottom padding in the ads
    // iframe.
    marginBottom: -16,
  },
  searchResultsContainer: {
    '& iframe': {
      width: '100%',
    },
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
    const { query } = this.props
    if (!query) {
      return
    }

    // Reset state of search results.
    this.setState({
      noSearchResults: false,
      unexpectedSearchError: false,
    })

    const self = this
    try {
      fetchSearchResults(query, err => {
        if (err.NO_COVERAGE) {
          // No results for this search.
          self.setState({
            noSearchResults: true,
          })
        } else if (err.URL_UNREGISTERED) {
          self.setState({
            unexpectedSearchError: true,
          })
          logger.error(
            new Error('Domain is not registered with our search partner.')
          )
        } else {
          self.setState({
            unexpectedSearchError: true,
          })
          logger.error(new Error('Unexpected search error:', err))
        }
      })
    } catch (e) {
      this.setState({
        unexpectedSearchError: true,
      })
      logger.error(e)
    }
  }

  componentDidMount() {
    // When prerendering the page, add an inline script to fetch
    // search results even before parsing our app JS.
    // TODO: have the inline script handle "no results" and
    //   search errors.
    if (isReactSnapClient()) {
      try {
        // TODO: add tests
        // FIXME: don't set fetchedOnPageLoad=true if there is no query.
        //   It causes the subsequent query to fail.
        const js = `
          try {
            // If there is a query on page load, fetch it.
            if (new URLSearchParams(window.location.search).get('q')) {
              window.ypaAds.insertMultiAd(${JSON.stringify(YPAConfiguration)})
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
  }

  componentDidUpdate(prevProps) {
    // Fetch search results if a query exists and the query
    // has changed.
    // TODO: add tests
    if (this.props.query && this.props.query !== prevProps.query) {
      // If this is the first query, we may have already fetched
      // results via inline script. Don't fetch them this time.
      const alreadyFetchedQuery =
        window.searchforacause.search.fetchedOnPageLoad
      if (alreadyFetchedQuery) {
        window.searchforacause.search.fetchedOnPageLoad = false
      } else {
        this.getSearchResults()
      }
    }
  }

  render() {
    const { query, classes, style } = this.props
    return (
      <div
        data-test-id="search-results-container"
        style={Object.assign(
          {},
          {
            // Min height prevents visibly shifting content below,
            // like the footer.
            minHeight: this.state.noSearchResults ? 0 : 1200,
            boxSizing: 'border-box',
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
        <div>
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
        </div>
      </div>
    )
  }
}

SearchResults.propTypes = {
  query: PropTypes.string,
  classes: PropTypes.object.isRequired,
  style: PropTypes.object,
}

SearchResults.defaultProps = {
  style: {},
}

export default withStyles(styles)(SearchResults)
