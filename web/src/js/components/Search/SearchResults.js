import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import logger from 'js/utils/logger'
import fetchSearchResults from 'js/components/Search/fetchSearchResults'
import YPAConfiguration from 'js/components/Search/YPAConfiguration'

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
      searchProviderJSLoaded: !!window.ypaAds,
      noSearchResults: false,
      unexpectedSearchError: false,
    }
  }

  getSearchResults() {
    // TODO: if it does not exist, don't query. Instead, load the
    //   script and wait for it to re-query.
    // console.log('getSearchResults: window.ypaAds exists:', !!window.ypaAds)
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

  // Commenting out because the inline script should call
  // for search results on page load.
  // componentDidMount() {
  //   if (this.props.query) {
  //     this.getSearchResults()
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (this.props.query && this.props.query !== prevProps.query) {
      this.getSearchResults()
    }
  }

  render() {
    const { query, classes, style } = this.props
    // TODO: set the "no results" callback on the Helmet script.
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
          <script>
            {`
            window.ypaAds.insertMultiAd(${JSON.stringify(YPAConfiguration)})
          `}
          </script>
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
          <div id="search-ads" className={classes.searchAdsContainer} />
          <div id="search-results" className={classes.searchResultsContainer} />
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
