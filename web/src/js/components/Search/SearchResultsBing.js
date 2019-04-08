import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import { range } from 'lodash/util'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'js/components/General/Link'
import logger from 'js/utils/logger'
import getMockBingSearchResults from 'js/components/Search/getMockBingSearchResults'
import { isReactSnapClient } from 'js/utils/search-utils'
import { getCurrentUser } from 'js/authentication/user'
import LogSearchMutation from 'js/mutations/LogSearchMutation'
import NewsSearchResults from 'js/components/Search/NewsSearchResults'
import WebPageSearchResult from 'js/components/Search/WebPageSearchResult'
import sanitizeHtml from 'sanitize-html'

const styles = theme => ({
  searchResultsParentContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  searchResultsContainer: {
    marginTop: 6,
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

const stripHTML = html => {
  return html
    ? sanitizeHtml(html, {
        allowedTags: [],
        allowedAttributes: {},
      })
    : undefined
}

class SearchResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResultsData: null,
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

  componentWillUnmount() {}

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
      unexpectedSearchError: false,
    })

    try {
      const searchResults = await getMockBingSearchResults()
      this.setState({
        searchResultsData: searchResults,
      })
    } catch (e) {
      this.setState({
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

  renderSearchResultItem(itemRankingData) {
    const { searchResultsData } = this.state

    // Get the data for this item.
    // https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/Bing-Web-Search/public/js/script.js#L168
    const typeName =
      itemRankingData.answerType[0].toLowerCase() +
      itemRankingData.answerType.slice(1)
    // https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/Tutorials/Bing-Web-Search/public/js/script.js#L172
    const itemDataRaw = !isNil(itemRankingData.resultIndex)
      ? // One result of the specified type (e.g., one webpage link)
        get(
          searchResultsData,
          `${typeName}.value[${itemRankingData.resultIndex}]`
        )
      : // All results of the specified type (e.g., all videos)
        get(searchResultsData, `${typeName}.value`)

    // Return null if we couldn't find the result item data.
    if (!itemDataRaw) {
      console.error(`Couldn't find item data for:`, itemRankingData)
      return null
    }

    // Render a different component depending on the result type.
    switch (itemRankingData.answerType) {
      case 'WebPages': {
        let webPageItem = Object.assign({}, itemDataRaw, {
          displayUrl: stripHTML(itemDataRaw.displayUrl),
          name: stripHTML(itemDataRaw.name),
          snippet: stripHTML(itemDataRaw.snippet),
        })
        return <WebPageSearchResult key={webPageItem.id} item={webPageItem} />
      }
      case 'News': {
        let newsItems = itemDataRaw.map(newsItem => {
          return Object.assign({}, newsItem, {
            description: stripHTML(newsItem.description),
            displayUrl: stripHTML(newsItem.displayUrl),
            name: stripHTML(newsItem.name),
          })
        })
        if (!newsItems.length) {
          console.error(`No news items found for:`, itemDataRaw)
          return null
        }
        return <NewsSearchResults key={'news-results'} newsItems={newsItems} />
      }
      default: {
        return null
      }
    }
  }

  render() {
    const {
      classes,
      isAdBlockerEnabled,
      page,
      query,
      style,
      theme,
    } = this.props
    const { searchResultsData } = this.state

    // eslint-disable-next-line no-unused-vars
    const poleResults = get(searchResultsData, 'rankingResponse.pole.items', [])
    const mainResults = get(
      searchResultsData,
      'rankingResponse.mainline.items',
      []
    )

    // eslint-disable-next-line no-unused-vars
    const sidebarResults = get(
      searchResultsData,
      'rankingResponse.sidebar.items',
      []
    )

    // Include 8 pages total, 4 lower and 4 higher when possible.
    // Page 9999 is the maximum, so stop there.
    const MIN_PAGE = 1
    const MAX_PAGE = 9999
    const paginationIndices = range(
      Math.max(MIN_PAGE, Math.min(page - 4, MAX_PAGE - 8)),
      Math.min(MAX_PAGE + 1, Math.max(page + 4, MIN_PAGE + 8))
    )

    // Whether there are no search results for whatever reason.
    const isEmptyQuery = this.state.mounted && !query
    const noResultsToDisplay =
      isEmptyQuery ||
      this.state.noSearchResults ||
      this.state.unexpectedSearchError ||
      isAdBlockerEnabled
    return (
      <div
        className={classes.searchResultsParentContainer}
        style={Object.assign(
          {},
          {
            // Min height prevents visibly shifting content below,
            // like the footer.
            minHeight: noResultsToDisplay ? 0 : 1200,
          },
          style
        )}
      >
        {this.state.noSearchResults ? (
          <Typography variant={'body1'} gutterBottom>
            No results found for{' '}
            <span style={{ fontWeight: 'bold' }}>{query}</span>
          </Typography>
        ) : null}
        {this.state.unexpectedSearchError || isAdBlockerEnabled ? (
          <div data-test-id={'search-err-msg'}>
            <Typography variant={'body1'} gutterBottom>
              Unable to search at this time.
            </Typography>
            {isAdBlockerEnabled ? null : (
              <Link
                to={`https://www.google.com/search?q=${encodeURI(query)}`}
                target="_top"
              >
                <Button color={'primary'} variant={'contained'} size={'small'}>
                  Search Google
                </Button>
              </Link>
            )}
          </div>
        ) : isEmptyQuery ? (
          <Typography variant={'body1'} gutterBottom>
            Search something to start raising money for charity!
          </Typography>
        ) : null}
        <div id="search-results" className={classes.searchResultsContainer}>
          {mainResults.map(result => this.renderSearchResultItem(result))}
        </div>
        <div
          data-test-id={'pagination-container'}
          className={classes.paginationContainer}
          style={{
            display: noResultsToDisplay ? 'none' : 'block',
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
  isAdBlockerEnabled: PropTypes.bool.isRequired,
  query: PropTypes.string,
  page: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  searchSource: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.object.isRequired,
}

SearchResults.defaultProps = {
  isAdBlockerEnabled: false,
  page: 1,
  style: {},
}

export default withStyles(styles, { withTheme: true })(SearchResults)
