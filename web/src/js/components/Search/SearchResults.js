import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  searchAdsContainer: {
    '& iframe': {
      width: '100%'
    }
  },
  searchResultsContainer: {
    '& iframe': {
      width: '100%'
    }
  }
})

function fetchSearchResults (query = null) {
  // TODO: handle zero search results or other fetch errors
  // TODO: style the search results
  window.ypaAds.insertMultiAd({
    ypaPubParams: {
      query: query
    },
    ypaAdConfig: '00000129a',
    ypaAdTypeTag: '',
    ypaAdSlotInfo: [
      {
        ypaAdSlotId: 'GY_Top_Center',
        ypaAdDivId: 'search-ads',
        ypaAdWidth: '600',
        ypaAdHeight: '891'
      },
      {
        ypaAdSlotId: 'GY_Algo',
        ypaAdDivId: 'search-results',
        ypaAdWidth: '600',
        ypaAdHeight: '827'
      }
    ]
  })
}

class SearchResults extends React.Component {
  getSearchResults () {
    if (!window.ypaAds) {
      console.error(`
        Search provider Javascript not loaded.
        Could not fetch search results.`
      )
      // TODO: show an error
      return
    }
    const { query } = this.props
    fetchSearchResults(query)
  }

  componentDidUpdate (prevProps) {
    if (this.props.query && this.props.query !== prevProps.query) {
      this.getSearchResults()
    }
  }

  render () {
    const { query, classes } = this.props
    if (!query) {
      return null
    }
    return (
      <div>
        <Helmet
          onChangeClientState={(newState, addedTags) => {
            // Fetch search results after the external JS has loaded.
            // https://github.com/nfl/react-helmet/issues/146#issuecomment-271552211
            // This solution isn't great for page speed when we're not
            // server-rendering this page.
            const self = this
            const { scriptTags } = addedTags
            if (scriptTags && scriptTags.length) {
              scriptTags[0].addEventListener('load', () => {
                self.getSearchResults()
              })
            }
          }
          }
        >
          <script src='https://s.yimg.com/uv/dm/scripts/syndication.js' />
        </Helmet>
        <div
          data-test-id='search-results-container'
          style={{
            background: 'none',
            marginLeft: 170,
            maxWidth: 600,
            paddingTop: 20
          }}
        >
          <div
            id='search-ads'
            className={classes.searchAdsContainer}
          />
          <div
            id='search-results'
            className={classes.searchResultsContainer}
          />
        </div>
      </div>
    )
  }
}

SearchResults.propTypes = {
  query: PropTypes.string,
  classes: PropTypes.object.isRequired
}

SearchResults.defaultProps = {}

export default withStyles(styles)(SearchResults)
