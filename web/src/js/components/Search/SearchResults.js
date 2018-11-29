import React from 'react'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash/lang'
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

const backgroundColor = '#fff'
// TODO: load Roboto font
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
    urlAboveDescription: true
    // How many lines to show the ad on.
    // adLayout: 3,
    // Additional CSS to apply to YPA classes.
    // cssLink: ''
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

const fetchSearchResults = (query = null) => {
  // TODO: handle zero search results or other fetch errors
  // TODO: style the search results

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
    // TODO: GDPR
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
        // TODO
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
        // TODO
        // Callback function for when there are no search results.
        // ypaOnNoAd: foo,
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
