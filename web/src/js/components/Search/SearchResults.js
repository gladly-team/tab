import React from 'react'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash/lang'
import { Helmet } from 'react-helmet'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import logger from 'js/utils/logger'

// Important: to modify some styles within the iframe, we
// pass an external stylesheet URL to the YPA API below.
// This file lives in web/public/. It does not get a hash
// appended to its filename, so we should rename it when
// it's modified. We should only add CSS to this external
// stylesheet when absolutely necessary.
const searchExternalCSSLink = 'https://tab.gladly.io/newtab/search-2018.29.11.16.35.css'

const styles = theme => ({
  searchAdsContainer: {
    '& iframe': {
      width: '100%'
    },
    // To address the unnecessary bottom padding in the ads
    // iframe.
    marginBottom: -16
  },
  searchResultsContainer: {
    '& iframe': {
      width: '100%'
    }
  }
})

const backgroundColor = '#fff'
const fontFamily = "'Roboto', arial, sans-serif"
const grey = '#aaa'
const resultStyle = {
  adSpacing: 26,
  lineSpacing: 18,
  title: {
    fontSize: 18,
    color: '#1a0dab',
    underline: false,
    bold: false,
    onHover: {
      color: '#1a0dab',
      underline: true
    }
  },
  description: {
    fontSize: 13,
    color: '#505050',
    underline: false,
    bold: false,
    onHover: {
      color: '#505050',
      underline: false
    }
  },
  URL: {
    fontSize: 13,
    color: '#007526',
    underline: false,
    bold: false,
    onHover: {
      color: '#007526',
      underline: false
    }
  }
}

const templateStyles = {
  AdUnit: {
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    lineSpacing: resultStyle.lineSpacing, // valid values: 8-25
    adSpacing: resultStyle.adSpacing, // valid values: 5-30
    font: fontFamily,
    urlAboveDescription: true,
    // How many lines to show the ad on.
    // adLayout: 3,
    // Additional CSS to apply within the YPA iframe.
    cssLink: searchExternalCSSLink
  },
  // The "Ads" label.
  AdUnitLabel: {
    position: 'Top Left',
    fontsize: 11, // valid values: 6-24
    color: grey
  },
  Title: {
    fontsize: resultStyle.title.fontSize,
    color: resultStyle.title.color,
    underline: resultStyle.title.underline,
    bold: resultStyle.title.bold,
    onHover: {
      color: resultStyle.title.onHover.color,
      underline: resultStyle.title.onHover.underline
    }
  },
  Description: {
    fontsize: resultStyle.description.fontSize,
    color: resultStyle.description.color,
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      color: resultStyle.description.onHover.color,
      underline: resultStyle.description.onHover.underline
    }
  },
  URL: {
    fontsize: resultStyle.URL.fontSize,
    color: resultStyle.URL.color,
    underline: resultStyle.URL.underline,
    bold: resultStyle.URL.bold,
    onHover: {
      color: resultStyle.URL.onHover.color,
      underline: resultStyle.URL.onHover.underline
    }
  },
  LocalAds: {
    fontsize: resultStyle.description.fontSize,
    color: grey,
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      color: resultStyle.description.onHover.color,
      underline: resultStyle.description.onHover.underline
    }
  },
  MerchantRating: {
    fontsize: resultStyle.description.fontSize,
    color: grey,
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      color: resultStyle.description.onHover.color,
      underline: resultStyle.description.onHover.underline
    }
  },
  SiteLink: {
    fontsize: resultStyle.description.fontSize,
    color: resultStyle.title.color, // same as title
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      // Same as title
      color: resultStyle.title.onHover.color,
      underline: resultStyle.title.onHover.underline
    }
  },
  EnhancedSiteLink: {
    fontsize: resultStyle.description.fontSize,
    color: resultStyle.title.color, // same as title
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      // Same as title
      color: resultStyle.title.onHover.color,
      underline: resultStyle.title.onHover.underline
    }
  },
  SmartAnnotations: {
    fontsize: resultStyle.description.fontSize,
    color: grey,
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      color: resultStyle.description.onHover.color,
      underline: resultStyle.description.onHover.underline
    }
  },
  ImageInAds: {
    align: 'right',
    size: '50x50'
  },
  OfficialSiteBadge: {
    fontsize: resultStyle.description.fontSize,
    color: backgroundColor,
    backgroundColor: grey
  },
  CallExtension: {
    fontsize: resultStyle.description.fontSize,
    color: resultStyle.title.color, // same as title
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      // Same as title
      color: resultStyle.title.onHover.color,
      underline: resultStyle.title.onHover.underline
    }
  }
}

/**
 * Call the YPA API to display search results in their iframe.
 * @param {String} query - The search query, unencoded.
 * @param {Function} onNoResults - A callback function that will
 *   be invoked if there are zero results for the search.
 * @return {undefined}
 */
const fetchSearchResults = (query = null, onNoResults = () => {}) => {
  const adOptions = {
    // The ad start rank and the ad end rank in the list of
    // search results.
    AdRange: '1-4',
    // Whether to show favicons near ads.
    Favicon: false,
    // Whether to show local ads.
    LocalAds: true,
    // Whether to use the "long ad title".
    Lat: true,
    // Whether to show "site links" in ads.
    SiteLink: true,
    // Whether to show merchant star ratings on ads.
    MerchantRating: true,
    // Whether to show images in ads.
    ImageInAds: false,
    // Whether to show "enhanced site links" in ads.
    EnhancedSiteLink: true,
    // Whether to show "smart annotations" in ads.
    SmartAnnotations: false,
    // Whether to show an "official site badge" next to ads
    // with a verified site.
    OfficialSiteBadge: true,
    // Whether to show an option to call the businesses next
    // to their ads.
    CallExtension: true,
    // Not in YPA documentation. Wheteher to show an
    // advertiser-selected review quote.
    ReviewExtension: false,
    // Not in YPA documentation. Wheteher to show a number
    // of keywords that look mostly unhelpful.
    CalloutExtension: false
  }

  // Fetch search results.
  // Note: YPA mutates objects we pass to it, so make sure to
  // clone everything we pass.
  window.ypaAds.insertMultiAd({
    ypaPubParams: {
      query: query
    },
    ypaAdTagOptions: {
      adultFilter: false // false means do not allow adult ads
    },
    ypaAdConfig: '00000129a',
    ypaAdTypeTag: '',
    // For now, we'll just show non-personalized ads in the EU:
    // "When gdpr=0 or missing, Oath will perform an IP check on the user
    // to determine jurisdiction. If euconsent is empty, or if the IAB string
    // is missing, Oath will return non-personalized search ads and search web
    // results."
    // gdpr: false
    // euconsent: '',
    ypaAdSlotInfo: [
      {
        ypaAdSlotId: 'GY_Top_Center',
        ypaAdDivId: 'search-ads',
        ypaAdWidth: '600',
        ypaAdHeight: '891',
        // Callback function for when there are no ads.
        // ypaOnNoAd: foo,
        ypaSlotOptions: {
          AdOptions: {
            Mobile: Object.assign({}, cloneDeep(adOptions), {
              AdRange: '1-2'
            }),
            DeskTop: Object.assign({}, cloneDeep(adOptions))
          },
          TemplateOptions: {
            Mobile: cloneDeep(templateStyles),
            DeskTop: cloneDeep(templateStyles)
          }
        }
      },
      {
        ypaAdSlotId: 'GY_Algo',
        ypaAdDivId: 'search-results',
        ypaAdWidth: '600',
        ypaAdHeight: '827',
        // Callback function for when there are no search results.
        ypaOnNoAd: onNoResults,
        ypaSlotOptions: {
          TemplateOptions: {
            Mobile: cloneDeep(templateStyles),
            DeskTop: cloneDeep(templateStyles)
          }
        }
      }
    ]
  })
}

class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      noSearchResults: false,
      unexpectedSearchError: false
    }
  }

  getSearchResults () {
    // TODO: move this to `fetchSearchResults` and throw an error.
    if (!window.ypaAds) {
      console.error(`
        Search provider Javascript not loaded.
        Could not fetch search results.`
      )
      this.setState({
        unexpectedSearchError: true
      })
      return
    }
    const { query } = this.props

    // Reset state of search results.
    this.setState({
      noSearchResults: false,
      unexpectedSearchError: false
    })

    const self = this
    try {
      fetchSearchResults(query, (err) => {
        if (err.NO_COVERAGE) {
          // No results for this search.
          self.setState({
            noSearchResults: true
          })
        } else if (err.URL_UNREGISTERED) {
          self.setState({
            unexpectedSearchError: true
          })
          throw new Error('Domain is not registered with our search partner.')
        } else {
          logger.error(new Error('Unexpected search error:', err))
        }
      })
    } catch (e) {
      this.setState({
        unexpectedSearchError: true
      })
      throw new Error('Unexpected search error:', e)
    }
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
          <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' />
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
          { this.state.noSearchResults
            ? (
              <Typography variant={'body1'} gutterBottom>
                No results found for <span style={{ fontWeight: 'bold' }}>{query}</span>
              </Typography>
            ) : null
          }
          { this.state.unexpectedSearchError
            ? (
              <Typography variant={'body1'} gutterBottom>
                Unable to search at this time.
              </Typography>
            ) : null
          }
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
