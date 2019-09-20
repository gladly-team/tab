import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { range } from 'lodash/util'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'js/components/General/Link'
import SearchResultItem from 'js/components/Search/SearchResultItem'
import SearchResultErrorMessage from 'js/components/Search/SearchResultErrorMessage'
import { showBingPagination } from 'js/utils/search-utils'
import { commaFormatted } from 'js/utils/utils'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import { SEARCH_INTRO_QUERY_ENGLISH } from 'js/constants'

// Pings Bing when the search results page loads.
class BingPageLoadPing extends React.Component {
  componentDidMount() {
    const { pageLoadPingUrl } = this.props
    if (pageLoadPingUrl) {
      fetch(pageLoadPingUrl).catch(e => {})
    }
  }

  render() {
    return null
  }
}

BingPageLoadPing.propTypes = {
  pageLoadPingUrl: PropTypes.string.isRequired,
}

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
    justifyContent: 'center',
    width: '100%',
    margin: 'auto auto 20px auto',
  },
  paginationButton: {
    color: 'rgba(0, 0, 0, 0.46)',
    minWidth: 40,
    margin: 6,
  },
  resultsAttributionContainer: {
    borderTop: '1px solid #e4e4e4',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  resultsAttribution: {
    padding: 8,
    color: '#cecece',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  resultsCountText: {
    color: 'rgba(0, 0, 0, 0.46)',
    paddingTop: 4,
    paddingBottom: 10,
  },
  noResultsMessages: {
    marginTop: 20,
  },
  firstSearchCardContainer: {
    padding: 20,
    marginBottom: 26,
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const SearchResultsBing = props => {
  const {
    classes,
    data,
    isEmptyQuery,
    isError,
    isQueryInProgress,
    onPageChange,
    page,
    query,
    queryReturned,
    style,
  } = props

  // Hiding until we make it functional.
  const SHOW_PAGINATION = showBingPagination()

  // Include 5 pages total, 2 lower and 2 higher when possible.
  // Page 9999 is the maximum, so stop there.
  const MIN_PAGE = 1
  const MAX_PAGE = 9999
  const paginationIndices = range(
    Math.max(MIN_PAGE, Math.min(page - 2, MAX_PAGE - 5)),
    Math.min(MAX_PAGE + 1, Math.max(page + 3, MIN_PAGE + 5))
  )

  const pageLoadPingUrl = get(data, 'instrumentation.pageLoadPingUrl')
  const noSearchResultsReturned = queryReturned && !data.results.mainline.length
  const noResultsToDisplay =
    isEmptyQuery ||
    !data.results.mainline.length ||
    isQueryInProgress ||
    isError

  return (
    <div
      className={classes.searchResultsParentContainer}
      style={Object.assign(
        {},
        {
          // Set a min-height during queries to prevent the footer
          // from flickering before the search results return.
          minHeight:
            isEmptyQuery || (queryReturned && !isQueryInProgress) ? 0 : 4000,
        },
        style
      )}
    >
      {isError ? (
        <SearchResultErrorMessage
          className={classes.noResultsMessages}
          query={query}
        />
      ) : isEmptyQuery ? (
        <Typography
          variant={'body1'}
          className={classes.noResultsMessages}
          gutterBottom
        >
          Search something to start raising money for charity!
        </Typography>
      ) : noSearchResultsReturned ? (
        <Typography
          variant={'body1'}
          className={classes.noResultsMessages}
          gutterBottom
        >
          No results found for{' '}
          <span style={{ fontWeight: 'bold' }}>{query}</span>
        </Typography>
      ) : isQueryInProgress ? null : (
        <div
          data-test-id={'search-results'}
          className={classes.searchResultsContainer}
          style={{
            display: noResultsToDisplay ? 'none' : 'block',
          }}
        >
          {pageLoadPingUrl ? (
            <BingPageLoadPing
              key={pageLoadPingUrl}
              pageLoadPingUrl={pageLoadPingUrl}
            />
          ) : null}
          {data.resultsCount ? (
            <Typography
              data-test-id={'search-results-count'}
              variant={'caption'}
              className={classes.resultsCountText}
            >
              {commaFormatted(data.resultsCount)} results
            </Typography>
          ) : null}
          {// If this is the first query, show our intro card
          !noResultsToDisplay && query === SEARCH_INTRO_QUERY_ENGLISH ? (
            <ErrorBoundary ignoreErrors>
              <Paper
                data-test-id={'first-search-card'}
                className={classes.firstSearchCardContainer}
                elevation={1}
              >
                <div>
                  <Typography
                    variant={'h4'}
                    data-test-id={'first-search-card-value'}
                    gutterBottom
                  >
                    Over 3.5 billion
                  </Typography>
                  <Typography
                    variant={'body2'}
                    data-test-id={'first-search-card-text'}
                    gutterBottom
                  >
                    With Search for a Cause, those searches could give 500,000
                    people access to clean water or protect 430 square miles of
                    rainforest each day!
                  </Typography>
                </div>
              </Paper>
            </ErrorBoundary>
          ) : null}
          {data.results.mainline.map(searchResultItemData => {
            return (
              <ErrorBoundary ignoreErrors key={searchResultItemData.key}>
                <SearchResultItem
                  key={searchResultItemData.key}
                  type={searchResultItemData.type}
                  itemData={searchResultItemData.value}
                  instrumentation={data.instrumentation}
                />
              </ErrorBoundary>
            )
          })}
          <div
            data-test-id={'search-results-attribution'}
            className={classes.resultsAttributionContainer}
          >
            <Link
              to={'https://privacy.microsoft.com/privacystatement'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography
                variant={'caption'}
                className={classes.resultsAttribution}
              >
                Results by Microsoft
              </Typography>
            </Link>
          </div>
        </div>
      )}
      {!!page && SHOW_PAGINATION && !noResultsToDisplay ? (
        <div
          data-test-id={'pagination-container'}
          className={classes.paginationContainer}
        >
          {page > MIN_PAGE ? (
            <Button
              key={'pagination-previous'}
              data-test-id={'pagination-previous'}
              className={classes.paginationButton}
              onClick={() => {
                onPageChange(page - 1)
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
                  color: 'rgba(0, 0, 0, 0.87)',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
                }),
              }}
              onClick={() => {
                onPageChange(pageNum)
              }}
            >
              {pageNum}
            </Button>
          ))}
          {page < MAX_PAGE ? (
            <Button
              key={'pagination-next'}
              data-test-id={'pagination-next'}
              className={classes.paginationButton}
              onClick={() => {
                onPageChange(page + 1)
              }}
            >
              NEXT
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

SearchResultsBing.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.shape({
    instrumentation: PropTypes.shape({
      _type: PropTypes.string,
      pageLoadPingUrl: PropTypes.string,
      pingUrlBase: PropTypes.string,
    }),
    resultsCount: PropTypes.number,
    results: PropTypes.shape({
      pole: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          key: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        })
      ).isRequired,
      mainline: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          key: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        })
      ).isRequired,
      sidebar: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          key: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        })
      ).isRequired,
    }).isRequired,
  }).isRequired,
  isEmptyQuery: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  isQueryInProgress: PropTypes.bool.isRequired,
  queryReturned: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  style: PropTypes.object,
  theme: PropTypes.object.isRequired,
}

SearchResultsBing.defaultProps = {}

export default withStyles(styles, { withTheme: true })(SearchResultsBing)
